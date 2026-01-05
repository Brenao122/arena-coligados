# SISTEMA ARENA COLIGADOS - COMPLETAMENTE FUNCIONAL

## FLUXO DO CLIENTE (CORRETO)

1. **CADASTRO PRIMEIRO** (`/reservar-quadra`)
   - Formulário com Nome, Telefone, CPF, Email
   - Dados salvos IMEDIATAMENTE como LEAD no Google Sheets
   - Status: "LEAD"

2. **MODALIDADE**
   - 4 cards visuais com checkmark quando selecionado
   - Beach Tennis, Vôlei, Futevôlei, Tênis
   - Avança automaticamente para data

3. **DATA**
   - 7 dias disponíveis
   - **MOSTRA NOME COMPLETO DO MÊS** ("15 de Janeiro")
   - Formatação pt-BR completa

4. **HORÁRIOS - DUAS UNIDADES LADO A LADO**
   - Grid com 2 colunas: Parque Amazônia | Vila Rosa
   - 14 horários por quadra (08:00-21:00)
   - Verde = Disponível | Vermelho = Ocupado
   - Filtra quadras pela modalidade selecionada
   - **Atualização automática a cada 10 segundos**

5. **PAGAMENTO PIX**
   - Cria reserva PENDENTE no Google Sheets
   - Gera PIX via ASAAS com chave específica por unidade
   - **QR Code Base64** exibido em tela
   - **Código Copia e Cola** com botão de copiar
   - Valor: 50% do total (reserva)

6. **VERIFICAÇÃO AUTOMÁTICA**
   - Polling a cada 5 segundos
   - Verifica status no ASAAS
   - Quando status = RECEIVED ou CONFIRMED → atualiza para CONFIRMADA

7. **TELA DE SUCESSO**
   - Check verde
   - Resumo completo da reserva
   - Botão voltar para home

---

## DASHBOARD ADMINISTRATIVO COMPLETO

### Acesso: `/admin/login`
- Senha configurada via variável de ambiente `ADMIN_PASSWORD`
- Middleware protege todas as rotas `/admin/*`

### Dashboard Principal (`/admin/dashboard`)

**Estatísticas em Tempo Real:**
- Total de Reservas
- Confirmadas (verde)
- Pendentes (amarelo)

**Alerta de Pendências:**
- Banner amarelo destacado quando há reservas pendentes
- Mensagem para contato com clientes

**Lista de Reservas:**
- Filtros: Todas / Confirmadas / Pendentes
- Cards com todas as informações:
  - Nome do cliente
  - Status com badge colorido
  - Modalidade
  - Unidade e Quadra
  - Data e Horário
  - Telefone (link direto para WhatsApp)
  - Email
  - Valores (reserva / total)
- **Botão de Cancelar** em cada reserva
- Atualização automática a cada 30 segundos

### Gerenciar Horários (`/admin/gerenciar-horarios`)

**Funcionalidades:**
- **BLOQUEAR horários**
  - Seleciona: Unidade → Quadra → Data → Horário
  - Campo opcional para motivo
  - Cria reserva tipo "BLOQUEIO" com status CONFIRMADA
  
- **DESBLOQUEAR horários**
  - Seleciona: Unidade → Quadra → Data → Horário
  - Busca o bloqueio e altera status para CANCELADA
  - Horário volta a ficar disponível

---

## APIs IMPLEMENTADAS E FUNCIONANDO

### Reservas
- `POST /api/sheets/append` - Salva LEAD e reservas
- `GET /api/sheets/reservas/list-all` - Lista todas as reservas
- `POST /api/sheets/reservas/update-status` - Atualiza status por payment_id
- `GET /api/reservas/check-disponibilidade` - Verifica horários ocupados

### ASAAS (Pagamento PIX)
- `POST /api/asaas/create-payment` - Gera PIX com QR Code
  - Detecta unidade automaticamente
  - Usa chave específica (PARQUE_AMAZONIA ou VILA_ROSA)
  - Retorna QR Code Base64 + Código Copia e Cola
  
- `GET /api/asaas/check-payment` - Verifica status do pagamento
  - Polling a cada 5 segundos
  - Retorna: PENDING, RECEIVED, CONFIRMED
  
- `POST /api/asaas/webhook` - Confirmação automática
  - Recebe notificações do ASAAS
  - Busca reserva pelo payment_id
  - Atualiza status para CONFIRMADA

### Bloqueio de Horários
- `POST /api/sheets/horarios/bloquear` - Bloqueia horário
- `POST /api/sheets/horarios/desbloquear` - Desbloqueia horário

### Autenticação Admin
- `POST /api/admin/auth` - Login admin
- `DELETE /api/admin/auth` - Logout

---

## INTEGRAÇÕES CONFIGURADAS

### Google Sheets
- **Planilha:** "leads - quadra"
- **Colunas (ordem):**
  1. timestamp
  2. data
  3. unidade
  4. quadra
  5. horarios
  6. modalidade
  7. nome
  8. telefone
  9. email
  10. cpf
  11. status (LEAD / PENDENTE / CONFIRMADA / CANCELADA / BLOQUEIO)
  12. payment_id
  13. valor_total
  14. valor_reserva
  15. motivo (opcional, para bloqueios)

### ASAAS
- **Ambiente:** Sandbox e Produção
- **Chaves separadas por unidade:**
  - `ASAAS_API_KEY_PARQUE_AMAZONIA`
  - `ASAAS_API_KEY_VILA_ROSA`

---

## VARIÁVEIS DE AMBIENTE NECESSÁRIAS

\`\`\`env
# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_SHEETS_SPREADSHEET_ID=...

# ASAAS
ASAAS_API_KEY_PARQUE_AMAZONIA=$aact_...
ASAAS_API_KEY_VILA_ROSA=$aact_...

# Admin
ADMIN_PASSWORD=suasenhaaqui
\`\`\`

---

## CONFIGURAÇÃO DO WEBHOOK ASAAS

Para confirmação automática, configure no painel do ASAAS:

1. Acesse **Integrações → Webhooks**
2. URL: `https://SEU-DOMINIO.vercel.app/api/asaas/webhook`
3. Eventos: `PAYMENT_RECEIVED` e `PAYMENT_CONFIRMED`
4. Repetir para as duas contas (Parque Amazônia e Vila Rosa)

---

## PROTEÇÕES IMPLEMENTADAS

1. **Anti-Concorrência**
   - Atualização automática de horários ocupados a cada 10s
   - Botões desabilitados para horários ocupados
   - Validação no backend antes de criar reserva

2. **Status Controlado**
   - LEAD: Cadastro inicial
   - PENDENTE: Aguardando pagamento
   - CONFIRMADA: Pagamento recebido
   - CANCELADA: Reserva cancelada pelo admin
   - BLOQUEIO: Horário bloqueado pelo admin

3. **Autenticação Admin**
   - Middleware protege rotas /admin/*
   - Login obrigatório em /admin/login
   - Sessão via cookies HTTP-only

---

## FLUXO DE BLOQUEIO/CANCELAMENTO

### Bloquear Horário (Admin)
1. Admin acessa `/admin/gerenciar-horarios`
2. Seleciona: Unidade, Quadra, Data, Horário
3. Opcional: Adiciona motivo
4. Clica em "Bloquear Horário"
5. Sistema cria reserva tipo "BLOQUEIO" com status CONFIRMADA
6. Horário aparece como ocupado para clientes

### Desbloquear Horário (Admin)
1. Admin acessa `/admin/gerenciar-horarios`
2. Seleciona o mesmo: Unidade, Quadra, Data, Horário
3. Clica em "Desbloquear Horário"
4. Sistema busca o bloqueio e muda status para CANCELADA
5. Horário volta a ficar disponível

### Cancelar Reserva (Admin)
1. Admin acessa `/admin/dashboard`
2. Localiza a reserva na lista
3. Clica no botão "Cancelar" (X vermelho)
4. Confirma a ação
5. Sistema atualiza status para CANCELADA
6. Horário volta a ficar disponível

---

## ESTÁ TUDO FUNCIONANDO!

O sistema está 100% completo e pronto para uso. Todos os requisitos foram implementados:

- Cadastro salva LEAD primeiro
- Horários das duas unidades lado a lado
- QR Code específico por unidade
- Confirmação automática via webhook
- Dashboard admin com dados reais
- Bloqueio/desbloqueio de horários
- Cancelamento de reservas
- Autenticação protegida

**PODE FAZER O DEPLOY NA VERCEL AGORA!**
