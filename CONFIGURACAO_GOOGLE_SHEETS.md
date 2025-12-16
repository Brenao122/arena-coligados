# 🔧 Configuração do Google Sheets - Arena Coligados

## ❌ Problema Atual

A plataforma não está salvando dados na planilha porque falta a variável de ambiente **`GOOGLE_PRIVATE_KEY`**.

## ✅ Variáveis Já Configuradas

- ✅ `GOOGLE_SERVICE_ACCOUNT_EMAIL` - arenasheets@credencial-n8n-471801.iam.gserviceaccount.com
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `GOOGLE_REFRESH_TOKEN`

## 🔑 Variável Faltando

- ❌ **`GOOGLE_PRIVATE_KEY`** - Chave privada do Service Account

---

## 📋 Como Adicionar a GOOGLE_PRIVATE_KEY

### Passo 1: Obter a Chave Privada

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione o projeto: **credencial-n8n-471801**
3. Vá em **IAM & Admin** → **Service Accounts**
4. Encontre a conta: **arenasheets@credencial-n8n-471801.iam.gserviceaccount.com**
5. Clique nos 3 pontinhos → **Manage Keys**
6. Clique em **Add Key** → **Create New Key**
7. Escolha o formato **JSON**
8. Baixe o arquivo JSON

### Passo 2: Extrair a Private Key do JSON

Abra o arquivo JSON baixado e procure o campo `private_key`. Ele terá este formato:

```json
{
  "type": "service_account",
  "project_id": "credencial-n8n-471801",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com",
  ...
}
```

Copie **TODO** o conteúdo do campo `private_key`, incluindo:
- `-----BEGIN PRIVATE KEY-----`
- Todo o texto do meio
- `-----END PRIVATE KEY-----`
- Os `\n` (quebras de linha)

### Passo 3: Adicionar no Vercel

1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione o projeto **Arena Coligados**
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Preencha:
   - **Name**: `GOOGLE_PRIVATE_KEY`
   - **Value**: Cole a chave privada completa (com `-----BEGIN PRIVATE KEY-----` e tudo)
   - **Environment**: Selecione **Production**, **Preview** e **Development**
6. Clique em **Save**

### Passo 4: Fazer Redeploy

Após adicionar a variável:
1. Vá em **Deployments**
2. Clique nos 3 pontinhos do último deployment
3. Clique em **Redeploy**

---

## 🧪 Testar a Configuração

Após configurar, acesse: **https://arenacoligados.com.br/diagnostico**

Esta página mostrará:
- ✅ Status de todas as variáveis de ambiente
- ✅ Teste de conexão com o Google Sheets
- ✅ Lista de abas disponíveis na planilha
- ✅ Teste de escrita (adiciona uma linha de teste)

---

## 📊 Estrutura da Planilha

**ID da Planilha**: `174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew`

### Abas Necessárias:

1. **Página1** - Reservas de quadra
   - Colunas: Data, Horário, Unidade, Quadra, Modalidade, Nome, Telefone, Email, Valor, Status, Timestamp

2. **Aulas** - Aulas experimentais
   - Colunas: Nome, Telefone, Email, Modalidade, Nível, Observações, Status, Timestamp

3. **Clientes** - Cadastro de clientes
4. **Professores** - Cadastro de professores
5. **Quadras** - Cadastro de quadras
6. **Pagamentos** - Registro de pagamentos

---

## 🔍 Diagnóstico de Erros

### Erro: "error:1E08010C:DECODER routines::unsupported"
- **Causa**: `GOOGLE_PRIVATE_KEY` está faltando ou mal formatada
- **Solução**: Adicione a variável conforme o Passo 3

### Erro: "Aba não encontrada"
- **Causa**: A aba especificada não existe na planilha
- **Solução**: Crie as abas necessárias na planilha do Google Sheets

### Erro: "Permission denied"
- **Causa**: A Service Account não tem permissão na planilha
- **Solução**: Compartilhe a planilha com `arenasheets@credencial-n8n-471801.iam.gserviceaccount.com` como Editor

---

## 📞 Suporte

Se após seguir todos os passos ainda houver problemas:
1. Acesse `/diagnostico` para ver logs detalhados
2. Verifique o console do navegador (F12) para erros
3. Entre em contato com o suporte técnico
