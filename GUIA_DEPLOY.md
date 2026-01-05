# Guia de Deploy - Arena Coligados

## Pré-requisitos

Todas as variáveis de ambiente necessárias já estão configuradas no projeto:

### Variáveis Essenciais ✅
- `NEXT_PUBLIC_SITE_URL` - URL do site
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Email da conta de serviço
- `GOOGLE_PRIVATE_KEY` - Chave privada do Google
- `GOOGLE_SHEETS_SPREADSHEET_ID` - ID da planilha
- `NEXT_PUBLIC_SUPABASE_URL` - URL do Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase
- `KV_REST_API_URL` - URL da API do Upstash
- `KV_REST_API_TOKEN` - Token da API do Upstash
- `ASAAS_API_KEY` - Chave da API do Asaas (geral)
- `ASAAS_API_KEY_PARQUE_AMAZONIA` - Chave específica Parque Amazônia
- `ASAAS_API_KEY_VILA_ROSA` - Chave específica Vila Rosa
- `CRON_SECRET` - Secret para cron jobs

## Passos para Deploy

### 1. Build Local (Opcional)
\`\`\`bash
npm run build
\`\`\`

Se o build passar localmente, está pronto para deploy!

### 2. Deploy na Vercel

#### Via Interface
1. Acesse https://vercel.com
2. Conecte o repositório GitHub
3. Configure o projeto:
   - Framework Preset: `Next.js`
   - Build Command: `next build`
   - Output Directory: `.next`
4. Clique em "Deploy"

#### Via CLI
\`\`\`bash
npm i -g vercel
vercel --prod
\`\`\`

### 3. Configurar Cron Jobs

Os cron jobs já estão configurados no `vercel.json`:

\`\`\`json
{
  "crons": [
    {
      "path": "/api/cron/sync-nextfit",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/limpar-reservas-expiradas",
      "schedule": "*/5 * * * *"
    }
  ]
}
\`\`\`

**Importante:** Na Vercel, vá em:
- Settings → Environment Variables
- Adicione `CRON_SECRET` com um valor seguro
- Este secret protege os endpoints de cron

### 4. Configurar Webhook ASAAS

Após o deploy, configure o webhook do ASAAS:

1. Acesse o painel do ASAAS
2. Vá em Configurações → Webhooks
3. Adicione a URL: `https://SEU_DOMINIO.vercel.app/api/asaas/webhook`
4. Selecione os eventos:
   - `PAYMENT_RECEIVED` (Pagamento Confirmado)
   - `PAYMENT_CONFIRMED` (Pagamento Confirmado)
5. Salve

## Verificações Pós-Deploy

### 1. Teste o Fluxo de Reserva
- Acesse `/reservar-quadra`
- Preencha o cadastro
- Selecione modalidade, data, unidade e horários
- Gere o PIX de teste

### 2. Verifique o Google Sheets
- Acesse a planilha
- Confirme que as abas existem:
  - Cadastros
  - Reservas  
  - Creditos (nova)
  - Horarios Bloqueados

### 3. Teste o Sistema de Cancelamento
- Acesse `/minhas-reservas`
- Digite o telefone usado no teste
- Verifique se a reserva aparece
- Teste o cancelamento

### 4. Monitore os Logs
\`\`\`bash
vercel logs --follow
\`\`\`

## Problemas Comuns

### Erro: "GOOGLE_PRIVATE_KEY not configured"
**Solução:** Verifique se a variável está com `\n` corretos. No Vercel, cole a chave exatamente como está no JSON do Google.

### Erro: "Aba não encontrada"
**Solução:** Certifique-se que as abas no Google Sheets têm os nomes EXATOS:
- `Cadastros`
- `Reservas`
- `Creditos`
- `Horarios Bloqueados`

### Cron Jobs não executam
**Solução:** 
1. Verifique se `CRON_SECRET` está configurado
2. Cron jobs só funcionam em planos Pro ou superior da Vercel
3. Para desenvolvimento, chame os endpoints manualmente

### Webhook ASAAS não atualiza status
**Solução:**
1. Verifique os logs do webhook no painel ASAAS
2. Confirme que a URL está correta
3. Teste manualmente: `POST /api/asaas/webhook`

## Estrutura de Arquivos Criados

### APIs Novas
- `/api/sheets/creditos/consultar/route.ts` - Consulta créditos do cliente
- `/api/sheets/reservas/buscar-por-telefone/route.ts` - Busca reservas por telefone
- `/api/sheets/reservas/cancelar-cliente/route.ts` - Cancela reserva e gera crédito
- `/api/cron/limpar-reservas-expiradas/route.ts` - Limpa reservas PENDENTES expiradas
- `/api/whatsapp/enviar-confirmacao/route.ts` - Envia WhatsApp automático
- `/api/whatsapp/testar/route.ts` - Testa estrutura de WhatsApp

### Páginas Novas
- `/minhas-reservas/page.tsx` - Consulta e cancelamento de reservas

### Melhorias Implementadas
- `/reservar-quadra/page.tsx` - Seleção de unidade, múltiplos horários, cronômetro
- `/admin/gerenciar-horarios/page.tsx` - Lista de bloqueios ativos

## Funcionalidades Implementadas

### Fase 1 - Crítico
- ✅ Seleção de unidade (Parque Amazônia / Vila Rosa)
- ✅ Horários de 30 minutos (06:00, 06:30, 07:00...)
- ✅ Seleção múltipla de até 3 horários
- ✅ Cronômetro visual de 10 minutos
- ✅ Sistema de expiração automática via cron
- ✅ CPF opcional no cadastro

### Fase 2 - UX
- ✅ Regras de modalidades por quadra
- ✅ Interface intuitiva e responsiva
- ✅ Feedback visual completo

### Fase 3 - Automação
- ✅ Sistema de cancelamento pelo cliente
- ✅ Política de crédito automática (100% ≥8h, 50% ≥4h)
- ✅ WhatsApp automático (estrutura completa)
- ✅ Dashboard admin atualizado

## Próximos Passos Opcionais

### Integrar WhatsApp Real
Atualmente a estrutura está pronta mas não envia mensagens reais.

**Opções:**
1. **Evolution API** (Recomendado) - WhatsApp Cloud API
2. **Baileys** - WhatsApp Web
3. **WhatsApp Business API** - Oficial (pago)

Para integrar, edite `/app/api/whatsapp/enviar-confirmacao/route.ts` e substitua o mock por chamadas reais à API escolhida.

## Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs: `vercel logs`
2. Teste as APIs individualmente
3. Consulte a documentação das integrações usadas

---

**Última atualização:** Implementação completa - Todas as fases concluídas
