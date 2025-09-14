# 📊 DIAGRAMAS DA ESTRUTURA - Arena Coligados

## 🏗️ **ARQUITETURA GERAL DA PLATAFORMA**

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARENA COLIGADOS PLATFORM                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🌐 FRONTEND (Next.js)                                         │
│  ├── Dashboard Admin                                            │
│  ├── Dashboard Professor                                        │
│  ├── Dashboard Cliente                                          │
│  ├── Formulários de Cadastro                                    │
│  └── Páginas Públicas                                           │
│                                                                 │
│  🔗 INTEGRAÇÃO                                                  │
│  ├── Google Sheets API                                          │
│  ├── Google Forms                                               │
│  ├── WhatsApp API                                               │
│  └── Email Services                                             │
│                                                                 │
│  📊 BACKEND (Google Sheets)                                     │
│  ├── Reservas                                                   │
│  ├── Clientes                                                   │
│  ├── Quadras                                                    │
│  ├── Professores                                                │
│  ├── Usuarios                                                   │
│  └── Leads                                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 👥 **HIERARQUIA DE USUÁRIOS**

```
                    👑 ADMINISTRADOR
                           │
                           ├── 🔐 Acesso Total
                           ├── 📊 Todos os Relatórios
                           ├── ⚙️ Configurações
                           └── 👥 Gerencia Usuários
                           │
                    ┌──────┴──────┐
                    │             │
              👨‍🏫 PROFESSOR    👤 CLIENTE
                    │             │
                    ├── 📅 Suas Aulas    ├── 📅 Suas Reservas
                    ├── 👥 Seus Alunos   ├── 📊 Histórico
                    ├── 📈 Relatórios    ├── 💳 Pagamentos
                    └── 🔒 Dados Limit.  └── 🔒 Dados Pessoais
```

## 🔄 **FLUXO DE NAVEGAÇÃO**

```
🏠 DASHBOARD ADMIN
    │
    ├── 📊 Cards Estatísticas
    │   ├── Reservas Hoje
    │   ├── Clientes Ativos
    │   ├── Receita Mês
    │   └── Quadras Ativas
    │
    └── ⚡ Ações Rápidas
        │
        ├── 📅 RESERVAS
        │   ├── Lista → Filtros → Nova Reserva
        │   └── Modal: Cliente + Quadra + Data/Hora
        │
        ├── 👥 CLIENTES
        │   ├── Lista → Busca → Novo Cliente
        │   └── Abas: Clientes | Leads
        │
        ├── 🏟️ QUADRAS
        │   ├── Lista → Status → Configurar
        │   └── Preços e Horários
        │
        ├── 👨‍🏫 PROFESSORES
        │   ├── Lista → Especialidades → Agenda
        │   └── Horários Disponíveis
        │
        ├── 📈 LEADS
        │   ├── Lista → Status → Converter
        │   └── Origem e Interesse
        │
        ├── 📊 RELATÓRIOS
        │   ├── Ocupação → Financeiro → Clientes
        │   └── Exportar Dados
        │
        ├── 💳 PAGAMENTOS
        │   ├── Lista → Status → Confirmar
        │   └── Filtros por Período
        │
        └── ⚙️ CONFIGURAÇÕES
            ├── Sistema → Usuários → Integrações
            └── Backup de Dados
```

## 📋 **ESTRUTURA DE DADOS (GOOGLE SHEETS)**

```
📊 PLANILHA: Arena Coligados
│
├── 📄 RESERVAS
│   ├── ID │ Cliente │ Quadra │ Tipo │ Data │ Hora Início │ Hora Fim │ Status │ Valor │ Obs
│   └── 🔗 Relacionamentos: Cliente → Clientes, Quadra → Quadras
│
├── 📄 CLIENTES
│   ├── ID │ Nome │ Email │ Telefone │ Nascimento │ Endereço │ Status │ Cadastro
│   └── 🔗 Usado em: Reservas, Pagamentos
│
├── 📄 QUADRAS
│   ├── ID │ Nome │ Tipo │ Capacidade │ Preço/Hora │ Status │ Observações
│   └── 🔗 Usado em: Reservas
│
├── 📄 PROFESSORES
│   ├── ID │ Nome │ Email │ Telefone │ Especialidade │ Horários │ Status
│   └── 🔗 Usado em: Reservas (opcional)
│
├── 📄 USUARIOS
│   ├── ID │ Nome │ Email │ Role │ Status │ Cadastro
│   └── 🔗 Define: Permissões no Sistema
│
└── 📄 LEADS
    ├── Data │ Nome │ Email │ Telefone │ Interesse │ Origem │ Status
    └── 🔗 Pode ser: Convertido em Cliente
```

## 🔄 **FLUXO DE CADASTRO PROPOSTO**

```
📝 FORMULÁRIO GOOGLE FORMS
    │
    ├── 👤 CADASTRO CLIENTE
    │   ├── Nome Completo
    │   ├── Email
    │   ├── Telefone
    │   ├── Data Nascimento
    │   ├── Endereço
    │   └── Como Conheceu
    │       │
    │       └── ✅ Vai para: ABA Clientes
    │
    ├── 📅 NOVA RESERVA
    │   ├── Selecionar Cliente
    │   ├── Selecionar Quadra
    │   ├── Tipo (Locação/Aula)
    │   ├── Data e Horário
    │   └── Observações
    │       │
    │       └── ✅ Vai para: ABA Reservas
    │
    ├── 🎯 LEAD/CONTATO
    │   ├── Nome
    │   ├── Email/Telefone
    │   ├── Interesse
    │   └── Origem
    │       │
    │       └── ✅ Vai para: ABA Leads
    │
    └── 📞 WHATSAPP INTEGRATION
        ├── Confirmação Automática
        ├── Lembrete 24h antes
        └── Feedback pós-reserva
```

## 🚀 **ARQUITETURA DE INTEGRAÇÃO**

```
🌐 GOOGLE FORMS
    │
    ├── 📝 Formulários Públicos
    │   ├── Cadastro Cliente
    │   ├── Nova Reserva
    │   ├── Contato/Lead
    │   └── Feedback
    │       │
    │       └── 📊 GOOGLE SHEETS
    │               │
    │               ├── 🔄 Apps Script
    │               │   ├── Validações
    │               │   ├── Emails Automáticos
    │               │   ├── Notificações
    │               │   └── Backup
    │               │       │
    │               │       └── 🎯 ARENA COLIGADOS PLATFORM
    │               │               │
    │               │               ├── 📱 WhatsApp API
    │               │               ├── 📧 Email Services
    │               │               ├── 💳 Payment Gateway
    │               │               └── 📊 Dashboard Updates
    │               │
    │               └── 🔗 API Integration
    │                   ├── Webhooks
    │                   ├── Real-time Sync
    │                   └── Data Validation
```

## 📱 **FLUXO DE USUÁRIO COMPLETO**

```
👤 CLIENTE NOVO
    │
    ├── 🌐 Acessa Site Arena Coligados
    │   ├── Vê Formulário de Cadastro
    │   ├── Preenche Dados
    │   └── Clica "Cadastrar"
    │       │
    │       └── ✅ GOOGLE FORMS
    │               │
    │               ├── 📊 Dados vão para Google Sheets
    │               ├── 📧 Email de boas-vindas automático
    │               ├── 📱 WhatsApp de confirmação
    │               └── 🔄 Dashboard atualizado em tempo real
    │
    ├── 📅 FAZ RESERVA
    │   ├── Acessa Formulário de Reserva
    │   ├── Seleciona Quadra e Horário
    │   ├── Confirma Dados
    │   └── Finaliza Reserva
    │       │
    │       └── ✅ GOOGLE FORMS
    │               │
    │               ├── 📊 Reserva salva no Google Sheets
    │               ├── 📧 Email de confirmação
    │               ├── 📱 WhatsApp com detalhes
    │               ├── 📅 Lembrete 24h antes
    │               └── 🔄 Dashboard atualizado
    │
    └── 🎯 EXPERIÊNCIA COMPLETA
        ├── Fácil de usar
        ├── Confirmações automáticas
        ├── Lembretes
        └── Suporte via WhatsApp
```

## 🎯 **BENEFÍCIOS DA SOLUÇÃO PROPOSTA**

```
✅ PARA A ARENA:
├── Redução de 80% no trabalho manual
├── Cadastros automáticos 24/7
├── Confirmações instantâneas
├── Relatórios em tempo real
├── Menos erros de digitação
└── Escalabilidade para crescimento

✅ PARA OS CLIENTES:
├── Cadastro rápido e fácil
├── Confirmações automáticas
├── Lembretes via WhatsApp
├── Acesso à área do cliente
├── Histórico de reservas
└── Experiência moderna

✅ PARA A EQUIPE:
├── Menos trabalho administrativo
├── Dados organizados automaticamente
├── Relatórios prontos
├── Foco no atendimento
├── Menos erros
└── Processo padronizado
```
