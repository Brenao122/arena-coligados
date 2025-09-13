# Configuração do Supabase - Arena Coligados

## Passos para Implementação:

### 1. Criar Projeto no Supabase
- Acesse https://supabase.com
- Crie novo projeto "arena-coligados"
- Anote URL e chaves do projeto

### 2. Executar Scripts SQL
- Execute os scripts na ordem:
  1. `01-create-tables.sql`
  2. `02-enable-rls.sql`
  3. `03-seed-data.sql`

### 3. Configurar Autenticação
- Habilitar Email/Password
- Configurar redirect URLs
- Configurar templates de email

### 4. Configurar Variáveis de Ambiente
- Copie `.env.example` para `.env.local`
- Preencha com suas chaves do Supabase

### 5. Migrar Componentes
- Substituir dados mock por queries Supabase
- Implementar autenticação real
- Configurar upload de imagens

## Próximos Passos:
1. Configurar projeto Supabase
2. Executar scripts SQL
3. Configurar variáveis de ambiente
4. Migrar autenticação
5. Migrar componentes um por vez
