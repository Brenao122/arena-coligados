# 📊 RELATÓRIO SUPABASE + N8N AUTOMAÇÃO

## 🎯 **OBJETIVO:**
Automatizar o preenchimento de planilhas Google Sheets com dados do Supabase usando n8n

---

## 🏗️ **ARQUITETURA PROPOSTA:**

```
📊 SUPABASE (Fonte de Dados)
    ↓ (Webhooks/APIs)
🔧 N8N (Automação)
    ↓ (Google Sheets API)
📋 GOOGLE SHEETS (Planilhas)
```

---

## 🔧 **CONFIGURAÇÃO SUPABASE:**

### **1. Webhooks do Supabase:**
```sql
-- Criar função para disparar webhook
CREATE OR REPLACE FUNCTION notify_n8n_webhook()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM net.http_post(
        url := 'https://seu-n8n-instance.com/webhook/supabase-arena',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := json_build_object(
            'table', TG_TABLE_NAME,
            'action', TG_OP,
            'data', row_to_json(NEW),
            'old_data', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END
        )::text
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER trigger_reservas_webhook
    AFTER INSERT OR UPDATE OR DELETE ON reservas
    FOR EACH ROW EXECUTE FUNCTION notify_n8n_webhook();

CREATE TRIGGER trigger_leads_webhook
    AFTER INSERT OR UPDATE OR DELETE ON leads
    FOR EACH ROW EXECUTE FUNCTION notify_n8n_webhook();

CREATE TRIGGER trigger_profiles_webhook
    AFTER INSERT OR UPDATE OR DELETE ON profiles
    FOR EACH ROW EXECUTE FUNCTION notify_n8n_webhook();
```

### **2. API Endpoints para N8N:**
```javascript
// app/api/n8n/sync/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table') || 'reservas';
    const limit = searchParams.get('limit') || '100';
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(parseInt(limit))
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      table,
      count: data.length,
      data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

---

## 🔧 **SCRIPT N8N - WORKFLOW COMPLETO:**

### **1. Workflow Principal (n8n JSON):**
```json
{
  "name": "Arena Coligados - Sync Supabase to Google Sheets",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "value": "0 */30 * * * *"
            }
          ]
        }
      },
      "id": "trigger-cron",
      "name": "Trigger - A cada 30min",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "https://fogtbptqvvhoqesljlen.supabase.co/rest/v1/reservas",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "supabaseApi",
        "options": {
          "headers": {
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
        }
      },
      "id": "supabase-reservas",
      "name": "Buscar Reservas",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "url": "https://fogtbptqvvhoqesljlen.supabase.co/rest/v1/leads",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "supabaseApi",
        "options": {
          "headers": {
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
        }
      },
      "id": "supabase-leads",
      "name": "Buscar Leads",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [460, 400]
    },
    {
      "parameters": {
        "url": "https://fogtbptqvvhoqesljlen.supabase.co/rest/v1/quadras",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "supabaseApi",
        "options": {
          "headers": {
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
        }
      },
      "id": "supabase-quadras",
      "name": "Buscar Quadras",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [460, 500]
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew",
        "sheetName": "Reservas",
        "columnToMatchOn": "id",
        "options": {
          "usePathForKeyRow": true,
          "pathForKeyRow": "data.id"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "id": "={{ $json.id }}",
            "cliente_nome": "={{ $json.cliente.nome }}",
            "quadra_nome": "={{ $json.quadra.nome }}",
            "data_inicio": "={{ $json.data_inicio }}",
            "data_fim": "={{ $json.data_fim }}",
            "valor_total": "={{ $json.valor_total }}",
            "status": "={{ $json.status }}",
            "tipo": "={{ $json.tipo }}",
            "created_at": "={{ $json.created_at }}"
          }
        }
      },
      "id": "google-sheets-reservas",
      "name": "Atualizar Planilha Reservas",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew",
        "sheetName": "Leads",
        "columnToMatchOn": "id",
        "options": {
          "usePathForKeyRow": true,
          "pathForKeyRow": "data.id"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "id": "={{ $json.id }}",
            "nome": "={{ $json.nome }}",
            "email": "={{ $json.email }}",
            "telefone": "={{ $json.telefone }}",
            "interesse": "={{ $json.interesse }}",
            "origem": "={{ $json.origem }}",
            "status": "={{ $json.status }}",
            "created_at": "={{ $json.created_at }}"
          }
        }
      },
      "id": "google-sheets-leads",
      "name": "Atualizar Planilha Leads",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.1,
      "position": [680, 400]
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew",
        "sheetName": "Quadras",
        "columnToMatchOn": "id",
        "options": {
          "usePathForKeyRow": true,
          "pathForKeyRow": "data.id"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "id": "={{ $json.id }}",
            "nome": "={{ $json.nome }}",
            "tipo": "={{ $json.tipo }}",
            "capacidade": "={{ $json.capacidade }}",
            "preco_hora": "={{ $json.preco_hora }}",
            "descricao": "={{ $json.descricao }}",
            "ativo": "={{ $json.ativo }}",
            "created_at": "={{ $json.created_at }}"
          }
        }
      },
      "id": "google-sheets-quadras",
      "name": "Atualizar Planilha Quadras",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.1,
      "position": [680, 500]
    }
  ],
  "connections": {
    "Trigger - A cada 30min": {
      "main": [
        [
          {
            "node": "Buscar Reservas",
            "type": "main",
            "index": 0
          },
          {
            "node": "Buscar Leads", 
            "type": "main",
            "index": 0
          },
          {
            "node": "Buscar Quadras",
            "type": "main", 
            "index": 0
          }
        ]
      ]
    },
    "Buscar Reservas": {
      "main": [
        [
          {
            "node": "Atualizar Planilha Reservas",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Buscar Leads": {
      "main": [
        [
          {
            "node": "Atualizar Planilha Leads",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Buscar Quadras": {
      "main": [
        [
          {
            "node": "Atualizar Planilha Quadras",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## 📋 **CONFIGURAÇÃO DAS PLANILHAS:**

### **1. Estrutura Google Sheets:**
```
📊 ABA: Reservas
├── id | cliente_nome | quadra_nome | data_inicio | data_fim | valor_total | status | tipo | created_at

📊 ABA: Leads  
├── id | nome | email | telefone | interesse | origem | status | created_at

📊 ABA: Quadras
├── id | nome | tipo | capacidade | preco_hora | descricao | ativo | created_at

📊 ABA: Dashboard
├── metricas | valores | data_atualizacao
```

---

## 🔧 **SCRIPT DE INSTALAÇÃO N8N:**

### **1. Docker Compose (n8n):**
```yaml
# docker-compose.yml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=arenacoligados123
      - WEBHOOK_URL=https://seu-dominio.com/
      - GENERIC_TIMEZONE=America/Sao_Paulo
    volumes:
      - n8n_data:/home/node/.n8n
    command: n8n start

volumes:
  n8n_data:
```

### **2. Instalação Local:**
```bash
# Instalar n8n globalmente
npm install -g n8n

# Configurar variáveis de ambiente
export N8N_BASIC_AUTH_ACTIVE=true
export N8N_BASIC_AUTH_USER=admin
export N8N_BASIC_AUTH_PASSWORD=arenacoligados123
export WEBHOOK_URL=https://seu-dominio.com/

# Iniciar n8n
n8n start
```

---

## 🔑 **CREDENCIAIS NECESSÁRIAS:**

### **1. Supabase:**
```env
SUPABASE_URL=https://fogtbptqvvhoqesljlen.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **2. Google Sheets:**
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=arenasheets@credencial-n8n-471801.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew
```

---

## 🚀 **FLUXO DE EXECUÇÃO:**

### **1. Automático (A cada 30 minutos):**
```
1. Trigger Cron dispara
2. N8N busca dados do Supabase
3. N8N atualiza Google Sheets
4. Log de execução salvo
```

### **2. Manual (Webhook):**
```
1. Dados inseridos no Supabase
2. Trigger dispara webhook
3. N8N recebe dados em tempo real
4. N8N atualiza planilha imediatamente
```

---

## 📊 **MONITORAMENTO:**

### **1. Logs N8N:**
```javascript
// Função para log de execução
function logExecution(workflow, status, data) {
  console.log(`[${new Date().toISOString()}] ${workflow}: ${status}`);
  console.log(`Dados processados: ${JSON.stringify(data)}`);
}
```

### **2. Métricas:**
```
- Execuções por hora/dia
- Dados sincronizados
- Erros e falhas
- Tempo de execução
```

---

## 🎯 **BENEFÍCIOS:**

### **✅ AUTOMAÇÃO COMPLETA:**
- Sincronização automática Supabase → Google Sheets
- Atualizações em tempo real via webhooks
- Backup automático dos dados

### **✅ FLEXIBILIDADE:**
- Configuração fácil via interface N8N
- Múltiplas abas e formatos
- Filtros e transformações de dados

### **✅ CONFIABILIDADE:**
- Logs detalhados de execução
- Tratamento de erros
- Retry automático em falhas

---

## 📋 **PRÓXIMOS PASSOS:**

1. **Instalar N8N** (Docker ou local)
2. **Configurar credenciais** (Supabase + Google)
3. **Importar workflow** JSON
4. **Testar sincronização**
5. **Configurar webhooks** em tempo real
6. **Monitorar execuções**

**Status: 🚀 PRONTO PARA IMPLEMENTAÇÃO**
