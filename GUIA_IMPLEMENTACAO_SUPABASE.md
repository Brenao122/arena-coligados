# Guia de Implementação Supabase - Arena Coligados

## 🚀 Passos para Configuração

### 1. Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Nome: `arena-coligados`
4. Senha do banco: (anote para referência)
5. Região: South America (São Paulo)

### 2. Executar Scripts SQL
Execute os scripts na ordem no SQL Editor do Supabase:
1. `scripts/01-create-tables.sql` (já existe - estrutura completa)
2. `scripts/04-insert-seed-data.sql` (dados de exemplo)

### 3. Configurar Autenticação
No painel do Supabase:
- **Authentication > Settings**
- Habilitar "Enable email confirmations": OFF (para desenvolvimento)
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/dashboard/**`

### 4. Configurar Variáveis de Ambiente
Adicione no Project Settings do v0:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
\`\`\`

### 5. Criar Usuários de Teste
Execute no SQL Editor:
\`\`\`sql
-- Criar usuário admin
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@arena.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- O trigger criará automaticamente o profile
\`\`\`

## 📋 Próximos Passos de Migração

### Fase 1: Autenticação
- [ ] Migrar `hooks/use-auth.tsx` para usar Supabase Auth
- [ ] Atualizar `components/auth/login-form.tsx`
- [ ] Configurar redirecionamentos

### Fase 2: Componentes de Dados
- [ ] Migrar `components/quadras/quadras-list.tsx`
- [ ] Migrar `components/reservas/reserva-form.tsx`
- [ ] Migrar `components/clientes/cliente-form.tsx`
- [ ] Migrar `components/professores/professor-form.tsx`

### Fase 3: Dashboards
- [ ] Atualizar dashboard admin com dados reais
- [ ] Atualizar dashboard professor
- [ ] Atualizar dashboard aluno

### Fase 4: Relatórios
- [ ] Conectar gráficos com dados reais
- [ ] Implementar filtros dinâmicos
- [ ] Adicionar exportação de dados

## 🔧 Comandos Úteis

### Verificar Conexão
\`\`\`typescript
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

if (isSupabaseConfigured()) {
  console.log('Supabase configurado!')
} else {
  console.log('Configure as variáveis de ambiente')
}
\`\`\`

### Testar Query
\`\`\`typescript
const { data, error } = await supabase
  .from('quadras')
  .select('*')
  .limit(5)

console.log('Quadras:', data)
\`\`\`

## ⚠️ Importante
- Execute os scripts SQL na ordem correta
- Configure as variáveis de ambiente antes de testar
- Use os helper functions em `lib/supabase.ts` para operações comuns
- Mantenha os dados mock como fallback durante a migração
