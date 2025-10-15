# Mapeamento de Dependências: Plataforma ↔ Planilha Google Sheets

## 📊 Visão Geral da Imagem Analisada

**Interface:** Arena Coligados - Gestão Esportiva

**Menu Lateral (Sidebar):**
1. 🏠 Dashboard
2. 📅 Reservas
3. 👥 Clientes
4. 📍 Quadras
5. 🎓 Professores
6. 💳 Pagamentos
7. 👤 Leads
8. 📊 Relatórios (destacado em gradiente laranja-verde)
9. 🩺 Diagnóstico
10. ⚙️ Configurações

**Usuário:** Usuário Mock (Admin)
**Clima:** 33°C - Parc ensolarado

---

## 🗂️ Estrutura da Planilha Google Sheets

**ID da Planilha:** `174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew`

### Abas Identificadas:
1. **leads - quadra** - Armazena reservas de quadras
2. **Clientes** - Dados de clientes
3. **Quadras** - Informações das quadras
4. **Professores** - Dados dos professores
5. **Pagamentos** - Histórico de pagamentos

---

## 🔄 Mapeamento Menu → Planilha

### 1. 🏠 **Dashboard**
**Página:** `app/dashboard/page.tsx`

**Dependências:**
- ❌ Não lê diretamente da planilha
- ✅ Pode usar dados agregados de outras APIs

**Status:** Precisa verificar se está consumindo dados das APIs

---

### 2. 📅 **Reservas**
**Página:** `app/dashboard/reservas/page.tsx`

**API:** `GET /api/sheets/reservas`
- **Lê da aba:** `leads - quadra`
- **Formato esperado:** Array de objetos com campos:
  - `cliente` (nome)
  - `email`
  - `telefone`
  - `quadra`
  - `data`
  - `horario` (pode ser intervalo "08:30 - 10:00" ou lista "08:30, 09:00")
  - `tipo` (Locação, Aula, etc.)
  - `status` (confirmada, pendente, cancelada)
  - `valor`

**Funcionalidades:**
- ✅ **LEITURA:** Busca todas as reservas da planilha
- ✅ **ESCRITA:** Adiciona novas reservas via `/api/sheets/append`
- ⚠️ **PROBLEMA IDENTIFICADO:** A API estava lendo da aba "reservas" mas os dados estão em "leads - quadra"

**Página de Reserva Pública:** `app/reservar-quadra/page.tsx`
- ✅ **LEITURA:** Verifica horários ocupados
- ✅ **ESCRITA:** Cria nova reserva
- ✅ **VALIDAÇÃO:** Impede reservas duplicadas no mesmo horário

---

### 3. 👥 **Clientes**
**Página:** `app/dashboard/clientes/page.tsx`

**API:** `GET /api/sheets/clientes`
- **Lê da aba:** `Clientes`
- **Formato esperado:** Array de objetos com campos:
  - `nome`
  - `email`
  - `telefone`
  - `cpf`
  - `dataCadastro`
  - `status`

**Funcionalidades:**
- ✅ **LEITURA:** Lista todos os clientes
- ⚠️ **ESCRITA:** Não identificada (precisa verificar se há formulário de cadastro)

---

### 4. 📍 **Quadras**
**Página:** `app/dashboard/quadras/page.tsx`

**API:** `GET /api/sheets/quadras`
- **Lê da aba:** `Quadras`
- **Formato esperado:** Array de objetos com campos:
  - `nome`
  - `tipo` (Futsal, Beach Tennis, etc.)
  - `arena` (Parque Amazônia, Vila Rosa)
  - `valor`
  - `status` (ativa, manutenção)

**Funcionalidades:**
- ✅ **LEITURA:** Lista todas as quadras
- ⚠️ **ESCRITA:** Não identificada

---

### 5. 🎓 **Professores**
**Página:** `app/dashboard/professores/page.tsx`

**API:** `GET /api/sheets/professores`
- **Lê da aba:** `Professores`
- **Formato esperado:** Array de objetos com campos:
  - `nome`
  - `email`
  - `telefone`
  - `especialidade`
  - `status`

**Funcionalidades:**
- ✅ **LEITURA:** Lista todos os professores
- ⚠️ **ESCRITA:** Não identificada

---

### 6. 💳 **Pagamentos**
**Página:** `app/dashboard/pagamentos/page.tsx`

**API:** `GET /api/sheets/pagamentos`
- **Lê da aba:** `Pagamentos`
- **Formato esperado:** Array de objetos com campos:
  - `cliente`
  - `valor`
  - `data`
  - `status` (pago, pendente, cancelado)
  - `metodo` (PIX, Cartão, Dinheiro)
  - `reservaId`

**Integração Externa:**
- ✅ **Asaas API:** Cria cobranças PIX
- ⚠️ **Sincronização:** Precisa verificar se pagamentos do Asaas são salvos na planilha

**APIs Relacionadas:**
- `POST /api/asaas/create-payment` - Cria cobrança no Asaas
- `GET /api/asaas/check-payment` - Verifica status do pagamento
- `POST /api/asaas/webhook` - Recebe notificações de pagamento

---

### 7. 👤 **Leads**
**Página:** `app/dashboard/leads/page.tsx`

**Dependências:**
- ⚠️ **Aba na planilha:** Provavelmente usa `leads - quadra` ou aba separada
- ⚠️ **API:** Precisa verificar se existe API específica

**Funcionalidades:**
- ⚠️ Precisa investigar

---

### 8. 📊 **Relatórios**
**Página:** `app/dashboard/relatorios/page.tsx`

**APIs Relacionadas:**
- `GET /api/sheets/financial-data` - Dados financeiros
- `GET /api/sheets/occupancy-data` - Taxa de ocupação

**Funcionalidades:**
- ✅ **LEITURA:** Agrega dados de múltiplas abas
- ❌ **ESCRITA:** Não escreve na planilha

---

### 9. 🩺 **Diagnóstico**
**Página:** `app/dashboard/diagnostico/page.tsx`

**APIs Relacionadas:**
- `GET /api/diagnostico/env-check` - Verifica variáveis de ambiente
- `GET /api/diagnostico/sheets-check` - Testa conexão com Google Sheets
- `POST /api/diagnostico/write-test` - Testa escrita na planilha

**Funcionalidades:**
- ✅ **LEITURA:** Testa leitura da planilha
- ✅ **ESCRITA:** Testa escrita na planilha
- ✅ **VALIDAÇÃO:** Verifica credenciais e permissões

---

### 10. ⚙️ **Configurações**
**Página:** `app/dashboard/configuracoes/page.tsx`

**Dependências:**
- ❌ Provavelmente não interage com a planilha
- ✅ Pode gerenciar variáveis de ambiente e integrações

---

## 🔧 APIs de Escrita na Planilha

### 1. **POST /api/sheets/append**
**Função:** Adiciona uma nova linha em qualquer aba da planilha

**Parâmetros:**
\`\`\`json
{
  "sheetName": "leads - quadra",
  "data": {
    "cliente": "João Silva",
    "email": "joao@email.com",
    "telefone": "62999999999",
    "quadra": "Quadra 1 - Futsal",
    "data": "2025-01-20",
    "horario": "08:30 - 10:00",
    "tipo": "Locação",
    "status": "pendente",
    "valor": "R$ 150,00"
  }
}
\`\`\`

**Usado por:**
- Página de reserva pública (`app/reservar-quadra/page.tsx`)
- Formulários de cadastro (se existirem)

---

## ⚠️ Problemas Identificados

### 1. **Inconsistência de Nomes de Abas**
- ❌ API de reservas estava lendo da aba "reservas"
- ✅ Dados reais estão na aba "leads - quadra"
- **Status:** CORRIGIDO

### 2. **Validação de Horários Duplicados**
- ❌ Sistema não verificava horários ocupados antes
- ✅ Implementada verificação de conflitos
- **Status:** CORRIGIDO

### 3. **Sincronização Asaas ↔ Planilha**
- ⚠️ Pagamentos criados no Asaas podem não estar sendo salvos na planilha
- **Status:** PRECISA VERIFICAR

### 4. **Falta de APIs de Escrita**
- ⚠️ Não há APIs para criar/editar clientes, quadras, professores
- ⚠️ Apenas leitura está implementada
- **Status:** PRECISA IMPLEMENTAR

---

## 📋 Checklist de Verificação

### Leitura de Dados (GET)
- [x] Reservas (`/api/sheets/reservas` → `leads - quadra`)
- [x] Clientes (`/api/sheets/clientes` → `Clientes`)
- [x] Quadras (`/api/sheets/quadras` → `Quadras`)
- [x] Professores (`/api/sheets/professores` → `Professores`)
- [x] Pagamentos (`/api/sheets/pagamentos` → `Pagamentos`)
- [ ] Leads (precisa verificar)

### Escrita de Dados (POST)
- [x] Reservas (`/api/sheets/append` → `leads - quadra`)
- [ ] Clientes (não implementado)
- [ ] Quadras (não implementado)
- [ ] Professores (não implementado)
- [ ] Pagamentos (precisa verificar sincronização com Asaas)
- [ ] Leads (precisa verificar)

### Validações
- [x] Verificação de horários duplicados
- [x] Validação de credenciais Google Sheets
- [ ] Validação de CPF/CNPJ
- [ ] Validação de formato de dados
- [ ] Tratamento de erros de rede

---

## 🔐 Credenciais Configuradas

- ✅ `GOOGLE_SERVICE_ACCOUNT_EMAIL`: arenasheets@credencial-n8n-471801.iam.gserviceaccount.com
- ✅ `GOOGLE_PRIVATE_KEY`: Configurada
- ✅ `ASAAS_API_KEY`: Configurada
- ✅ Planilha compartilhada com a conta de serviço

---

## 🚀 Próximos Passos Recomendados

1. **Implementar APIs de Escrita Completas**
   - POST para criar clientes
   - POST para criar quadras
   - POST para criar professores
   - PUT para editar registros
   - DELETE para remover registros

2. **Sincronização Asaas → Planilha**
   - Webhook do Asaas deve salvar pagamentos confirmados na planilha
   - Atualizar status de reservas quando pagamento for confirmado

3. **Validações Adicionais**
   - Validar CPF/CNPJ antes de salvar
   - Validar formato de telefone
   - Validar formato de email
   - Validar datas e horários

4. **Melhorias de Performance**
   - Implementar cache de dados
   - Usar SWR para revalidação automática
   - Implementar paginação para listas grandes

5. **Auditoria e Logs**
   - Registrar todas as operações de escrita
   - Criar log de alterações
   - Implementar sistema de backup

---

## 📞 Contato para Suporte

Se precisar de ajuda com a integração, verifique:
1. Variáveis de ambiente no painel "Vars"
2. Logs no console do navegador
3. Página de diagnóstico (`/dashboard/diagnostico`)
