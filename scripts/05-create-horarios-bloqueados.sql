-- =========================================================
-- ARENA COLIGADOS - GESTÃO DE HORÁRIOS BLOQUEADOS
-- Tabela para bloquear/desbloquear horários por unidade e quadra
-- =========================================================

-- 1) TABELA DE HORÁRIOS BLOQUEADOS
create table if not exists public.horarios_bloqueados (
  id uuid default gen_random_uuid() primary key,
  quadra_id text not null,              -- ex: "Parque Amazônia-Quadra 01"
  quadra_nome text not null,             -- ex: "Quadra 01"
  unidade text not null,                 -- "Parque Amazônia" ou "Vila Rosa"
  data date not null,
  horario_inicio time not null,          -- ex: "08:00"
  horario_fim time not null,             -- ex: "09:00"
  bloqueado boolean default false,
  motivo text,                           -- ex: "Manutenção", "Evento privado"
  criado_por uuid references public.profiles(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint horarios_bloqueados_unique unique(quadra_id, data, horario_inicio)
);

-- 2) ÍNDICES PARA PERFORMANCE
create index if not exists idx_horarios_bloqueados_quadra_id on public.horarios_bloqueados(quadra_id);
create index if not exists idx_horarios_bloqueados_unidade on public.horarios_bloqueados(unidade);
create index if not exists idx_horarios_bloqueados_data on public.horarios_bloqueados(data);
create index if not exists idx_horarios_bloqueados_bloqueado on public.horarios_bloqueados(bloqueado);
create index if not exists idx_horarios_bloqueados_query on public.horarios_bloqueados(unidade, quadra_id, data, bloqueado);

-- 3) ROW-LEVEL SECURITY
alter table public.horarios_bloqueados enable row level security;

-- Apenas admin pode inserir/atualizar/deletar
drop policy if exists horarios_bloqueados_admin on public.horarios_bloqueados;
create policy horarios_bloqueados_admin on public.horarios_bloqueados
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Qualquer um pode ler (pública, necessária para verificar disponibilidade)
drop policy if exists horarios_bloqueados_select_public on public.horarios_bloqueados;
create policy horarios_bloqueados_select_public on public.horarios_bloqueados
for select
using (true);

-- 4) AUDITORIA
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_audit_horarios_bloqueados') then
    create trigger trg_audit_horarios_bloqueados
      after insert or update or delete on public.horarios_bloqueados
      for each row execute function public.audit_log();
  end if;
end$$;

-- 5) DADOS INICIAIS (exemplo: próximos 90 dias vazios)
do $$
declare
  v_data date;
  v_hora_inicio time;
  v_hora_fim time;
  v_quadra_id text;
  v_unidade text;
  v_quadra_nome text;
begin
  -- Apenas popular se a tabela estiver vazia
  if (select count(*) from public.horarios_bloqueados) = 0 then
    -- Para cada unidade e quadra
    for v_unidade, v_quadra_id, v_quadra_nome in
      select distinct 
        unidade,
        quadra_id, 
        quadra_nome
      from (
        values
          ('Parque Amazônia', 'Parque Amazônia-Quadra 01', 'Quadra 01'),
          ('Parque Amazônia', 'Parque Amazônia-Quadra 02', 'Quadra 02'),
          ('Parque Amazônia', 'Parque Amazônia-Quadra 03', 'Quadra 03'),
          ('Parque Amazônia', 'Parque Amazônia-Quadra 04', 'Quadra 04'),
          ('Parque Amazônia', 'Parque Amazônia-Quadra 05', 'Quadra 05'),
          ('Vila Rosa', 'Vila Rosa-Q1', 'Q1'),
          ('Vila Rosa', 'Vila Rosa-Q2', 'Q2'),
          ('Vila Rosa', 'Vila Rosa-Q3', 'Q3'),
          ('Vila Rosa', 'Vila Rosa-Q4', 'Q4')
      ) as quadras(unidade, quadra_id, quadra_nome)
    loop
      -- Para cada dia dos próximos 90 dias
      for v_data in 
        select current_date + interval '1 day' * generate_series(0, 89)
      loop
        -- Para cada horário (08:00 a 21:00, em slots de 1 hora)
        for v_hora_inicio, v_hora_fim in
          select 
            make_time(h, 0, 0),
            make_time(h+1, 0, 0)
          from generate_series(8, 20) as h
        loop
          insert into public.horarios_bloqueados (
            quadra_id, quadra_nome, unidade, data, 
            horario_inicio, horario_fim, bloqueado, motivo
          )
          values (
            v_quadra_id, v_quadra_nome, v_unidade, v_data,
            v_hora_inicio, v_hora_fim, false, null
          )
          on conflict (quadra_id, data, horario_inicio) do nothing;
        end loop;
      end loop;
    end loop;
    
    raise notice 'Horários inicializados com sucesso para os próximos 90 dias';
  end if;
end$$;

-- Confirmação final
select 
  count(*) as total_horarios,
  min(data) as primeira_data,
  max(data) as ultima_data,
  count(distinct quadra_id) as total_quadras,
  count(distinct unidade) as total_unidades
from public.horarios_bloqueados;
