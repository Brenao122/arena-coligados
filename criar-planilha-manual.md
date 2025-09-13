# 📊 CRIAR PLANILHA MANUALMENTE - ARENA COLIGADOS

## 🎯 **PASSO A PASSO:**

### **1. Criar Nova Planilha:**
- Acesse: https://sheets.google.com
- Clique em "Nova planilha"
- Nome: **"ArenaColigados - Data"**

### **2. Criar as Abas (9 abas):**

#### **📋 ABA: leads**
```
id | nome | telefone | email | origem | status | observacoes | created_at | updated_at
```

#### **👥 ABA: clientes**
```
id | nome | telefone | email | endereco | data_nascimento | created_at | updated_at
```

#### **🏟️ ABA: quadras**
```
id | nome | tipo | preco_hora | status | descricao | created_at | updated_at
```

#### **👨‍🏫 ABA: professores**
```
id | nome | telefone | email | especialidade | status | created_at | updated_at
```

#### **📅 ABA: reservas**
```
id | cliente_id | quadra_id | professor_id | data_inicio | data_fim | tipo | status | valor_total | observacoes | created_at | updated_at
```

#### **💰 ABA: pagamentos**
```
id | reserva_id | valor | metodo | status | data_pagamento | created_at | updated_at
```

#### **⭐ ABA: avaliacoes**
```
id | cliente_id | professor_id | reserva_id | nota | comentario | created_at | updated_at
```

#### **📊 ABA: dashboard**
```
metrica | valor | data | observacoes
```

#### **📝 ABA: logs**
```
id | acao | usuario | dados | created_at
```

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
```env
GOOGLE_SHEETS_SPREADSHEET_ID=1ABC123...
```

## 🚀 **DEPOIS DISSO:**
1. **Testar APIs** (`/api/sheets/read` e `/api/sheets/append`)
2. **Migrar telas** do Supabase para Google Sheets
3. **Implementar dashboard** com dados das planilhas

## ⏱️ **TEMPO ESTIMADO:** 5-10 minutos
