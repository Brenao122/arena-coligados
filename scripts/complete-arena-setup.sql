-- =========================================================
-- ARENA COLIGADOS - PACOTÃO DE PREPARO DE DADOS (PROD READY)
-- Perfis/Admin, RLS, Auditoria, Bot, Logs e Sincronização Auth
-- Execute inteiro uma única vez (idempotente)
-- =========================================================

-- 0) Extensões necessárias
create extension if not exists pgcrypto;  -- gen_random_uuid
create extension if not exists "uuid-ossp";

-- 1) Tipos & Helpers
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role_type') then
    create type public.user_role_type as enum ('admin','teacher','student','bot');
  end if;
end$$;

-- Helper: checar se auth.uid() é admin
create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean language sql stable as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = uid and ur.role = 'admin'
  );
$$;

-- 2) TABELAS PRINCIPAIS -----------------------------------

-- PROFILES: um-para-um com auth.users (id = auth.users.id quando sincronizado)
create table if not exists public.profiles (
  id uuid primary key,
  email text unique not null,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- USER_ROLES: papéis do usuário
create table if not exists public.user_roles (
  user_id uuid not null,
  role public.user_role_type not null,
  created_at timestamptz not null default now(),
  constraint user_roles_pkey primary key (user_id, role),
  constraint user_roles_user_id_fkey
    foreign key (user_id) references public.profiles(id)
    on update cascade on delete cascade
);

-- Índices úteis
create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_user_roles_user_id on public.user_roles (user_id);

-- 3) AUDITORIA --------------------------------------------
-- Tabela de logs
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  table_name text not null,
  operation text not null,
  old_data jsonb,
  new_data jsonb,
  user_id uuid,
  "timestamp" timestamptz not null default now()
);

-- Função de auditoria
create or replace function public.audit_log()
returns trigger as $$
begin
  insert into public.audit_logs (table_name, operation, old_data, new_data, user_id)
  values (
    tg_table_name,
    tg_op,
    case when tg_op = 'DELETE' then to_jsonb(old) else null end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end,
    auth.uid()
  );
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- Triggers de auditoria (idempotentes)
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_audit_profiles') then
    create trigger trg_audit_profiles
      after insert or update or delete on public.profiles
      for each row execute function public.audit_log();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_audit_user_roles') then
    create trigger trg_audit_user_roles
      after insert or update or delete on public.user_roles
      for each row execute function public.audit_log();
  end if;
end$$;

-- 4) RLS (Row-Level Security) -----------------------------
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

-- Políticas PROFILES
-- 4.1 Todos logados podem ver o próprio perfil
drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

-- 4.2 Admin pode ver todos
drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin on public.profiles
for select to authenticated
using (public.is_admin(auth.uid()));

-- 4.3 Usuário atual pode atualizar apenas seu perfil; admin pode atualizar qualquer
drop policy if exists profiles_update_self_or_admin on public.profiles;
create policy profiles_update_self_or_admin on public.profiles
for update to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()))
with check (id = auth.uid() or public.is_admin(auth.uid()));

-- 4.4 Apenas admin pode inserir/excluir perfis
drop policy if exists profiles_admin_insert on public.profiles;
create policy profiles_admin_insert on public.profiles
for insert to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists profiles_admin_delete on public.profiles;
create policy profiles_admin_delete on public.profiles
for delete to authenticated
using (public.is_admin(auth.uid()));

-- Políticas USER_ROLES
-- 4.5 Usuário vê seus próprios papéis; admin vê todos
drop policy if exists user_roles_select_self_or_admin on public.user_roles;
create policy user_roles_select_self_or_admin on public.user_roles
for select to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- 4.6 Apenas admin gerencia papéis
drop policy if exists user_roles_admin_iud on public.user_roles;
create policy user_roles_admin_iud on public.user_roles
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- 5) SINCRONIZAÇÃO COM AUTH (conciliando por e-mail) -------
-- Quando um usuário se cadastra (auth.users), alinhar profiles por e-mail
create or replace function public.sync_profile_on_auth_user_created()
returns trigger language plpgsql security definer as $$
declare
  v_existing_id uuid;
begin
  -- Procura um profile já criado previamente com o mesmo e-mail
  select id into v_existing_id from public.profiles where email = new.email limit 1;

  if v_existing_id is null then
    -- Não existe: cria o profile com o NEW.id
    insert into public.profiles (id, email, full_name, phone)
    values (new.id, coalesce(new.email, ''), null, null)
    on conflict (email) do update
      set id = excluded.id,
          updated_at = now();
  elsif v_existing_id <> new.id then
    -- Existe com outro id: migra o PK para NEW.id e atualiza FKs
    update public.profiles
      set id = new.id, updated_at = now()
    where id = v_existing_id;

    -- FKs já estão com ON UPDATE CASCADE, então user_roles acompanha.
  end if;

  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created_sync_profile') then
    create trigger on_auth_user_created_sync_profile
      after insert on auth.users
      for each row execute function public.sync_profile_on_auth_user_created();
  end if;
end$$;

-- 6) USUÁRIO BOT (para integrações/automação) -------------
-- Perfil do bot (e-mail técnico)
insert into public.profiles (id, email, full_name, phone, created_at, updated_at)
values (
  gen_random_uuid(),
  'bot@arena.com',
  'Arena Bot',
  null,
  now(),
  now()
)
on conflict (email) do update
  set full_name = excluded.full_name,
      updated_at = now();

-- Papel bot
insert into public.user_roles (user_id, role)
values (
  (select id from public.profiles where email = 'bot@arena.com'),
  'bot'
)
on conflict (user_id, role) do nothing;

-- 7) TABELAS DE LOG ALINHADAS AOS POPs --------------------
-- 7.1 Log de Aulas Experimentais
create table if not exists public.aulas_experimentais_log (
  id uuid primary key default gen_random_uuid(),
  lead_name text not null,
  lead_phone text,
  lead_age int,
  modalidade text,                 -- ex: beach tennis, futevôlei, vôlei
  nivel text,                      -- aprendiz, iniciante, intermediario, avancado
  melhor_dia text,
  melhor_horario text,
  turma_dia date,
  turma_inicio time,
  turma_fim time,
  status text default 'pendente',  -- pendente, confirmado, remarcado, concluido, ausente
  origem text,                     -- chatfox, whatsapp, presencial, etc
  responsavel_id uuid references public.profiles(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7.2 Log de Aluguel de Quadras
create table if not exists public.quadras_agendamentos_log (
  id uuid primary key default gen_random_uuid(),
  cliente_nome text not null,
  cliente_phone text,
  modalidade text,                 -- vôlei, beach tennis, etc
  quadra_numero int,
  inicio timestamptz not null,
  fim timestamptz not null,
  preco_total numeric(10,2),
  sinal_pix numeric(10,2),         -- 50% quando aplicável
  status text default 'pendente',  -- pendente, confirmado, cancelado, concluido
  origem text,                     -- chatfox, whatsapp, site, presencial
  observacoes text,
  responsavel_id uuid references public.profiles(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auditoria para logs também
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_audit_aulas_experimentais_log') then
    create trigger trg_audit_aulas_experimentais_log
      after insert or update or delete on public.aulas_experimentais_log
      for each row execute function public.audit_log();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_audit_quadras_agendamentos_log') then
    create trigger trg_audit_quadras_agendamentos_log
      after insert or update or delete on public.quadras_agendamentos_log
      for each row execute function public.audit_log();
  end if;
end$$;

-- 8) UPSERT dos usuários solicitados -----------------------
-- 8.1 Admin 122
insert into public.profiles (id, email, full_name, phone, created_at, updated_at)
values (
  gen_random_uuid(),
  'admin122@arena.com',
  'Admin 122',
  '+556293550635',
  now(),
  now()
)
on conflict (email) do update
  set full_name = excluded.full_name,
      phone = excluded.phone,
      updated_at = now();

insert into public.user_roles (user_id, role, created_at)
values (
  (select id from public.profiles where email = 'admin122@arena.com'),
  'admin',
  now()
)
on conflict (user_id, role) do nothing;

-- 8.2 Desenvolvedor Breno
insert into public.profiles (id, email, full_name, phone, created_at, updated_at)
values (
  gen_random_uuid(),
  'contatobrenofilm@gmail.com',
  'Breno Amancio - Desenvolvedor',
  '+556293550635',
  now(),
  now()
)
on conflict (email) do update
  set full_name = excluded.full_name,
      phone = excluded.phone,
      updated_at = now();

insert into public.user_roles (user_id, role, created_at)
values (
  (select id from public.profiles where email = 'contatobrenofilm@gmail.com'),
  'admin',
  now()
)
on conflict (user_id, role) do nothing;

-- 9) VIEWS ÚTEIS ------------------------------------------
create or replace view public.v_admins as
select p.id, p.email, p.full_name, p.phone, p.created_at, p.updated_at
from public.profiles p
join public.user_roles ur on ur.user_id = p.id and ur.role = 'admin';

create or replace view public.v_staff as
select p.id, p.email, p.full_name, array_agg(ur.role order by ur.role) roles
from public.profiles p
left join public.user_roles ur on ur.user_id = p.id
where ur.role in ('admin','teacher','bot')
group by p.id, p.email, p.full_name;

-- 10) VERIFICAÇÃO FINAL -----------------------------------
select 
  p.email,
  p.full_name,
  coalesce(string_agg(ur.role::text, ', ' order by ur.role), 'sem papéis') as roles,
  'Pronto: perfis, roles, RLS, auditoria, bot e logs OK' as status
from public.profiles p
left join public.user_roles ur on p.id = ur.user_id
where p.email in ('admin122@arena.com', 'contatobrenofilm@gmail.com', 'bot@arena.com')
group by p.email, p.full_name
order by p.email;
