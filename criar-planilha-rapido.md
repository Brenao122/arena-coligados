# 📊 CRIAR PLANILHA RAPIDAMENTE - ARENA COLIGADOS

## 🎯 **PASSO A PASSO RÁPIDO (5 MINUTOS):**

### **1. Criar Nova Planilha:**
- Acesse: https://sheets.google.com
- Clique em "Nova planilha"
- Nome: **"ArenaColigados - Data"**

### **2. Criar as 9 Abas:**
Clique no "+" (adicionar aba) e crie:

1. **leads**
2. **clientes** 
3. **reservas**
4. **professores**
5. **quadras**
6. **avaliacoes**
7. **pagamentos**
8. **dashboard**
9. **logs**

### **3. Compartilhar com Service Account:**
- Clique em "Compartilhar" (canto superior direito)
- Adicione: **`arenasheets@credencial-n8n-471801.iam.gserviceaccount.com`**
- Permissão: **"Editor"**
- Clique em "Enviar"

### **4. Copiar o ID da Planilha:**
- Na URL da planilha, copie o ID (parte entre /d/ e /edit)
- Exemplo: `https://docs.google.com/spreadsheets/d/1ABC123.../edit`
- ID: **`1ABC123...`**

### **5. Adicionar ao .env.local:**
\`\`\`env
GOOGLE_SHEETS_SPREADSHEET_ID=1ABC123...
\`\`\`

## 🚀 **DEPOIS DISSO:**
1. **Testar APIs** (`/api/sheets/read` e `/api/sheets/append`)
2. **Migrar telas** do Supabase para Google Sheets
3. **Implementar dashboard** com dados das planilhas

## ⏱️ **TEMPO ESTIMADO:** 5 minutos
