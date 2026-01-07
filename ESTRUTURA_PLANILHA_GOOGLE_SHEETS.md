# ESTRUTURA DA PLANILHA DO GOOGLE SHEETS - ARENA COLIGADOS

## VISÃO GERAL
Este documento descreve a estrutura completa das abas e colunas necessárias na planilha do Google Sheets para que a plataforma Arena Coligados funcione 100% conectada aos dados reais.

---

## ABA 1: "Página1" (Reservas de Quadra - Formulário Público)

**Descrição:** Armazena as reservas feitas através do formulário público de reserva de quadra.

**Colunas:**
- **A - Data/Hora:** Timestamp do cadastro (ex: 08/10/2025 14:30)
- **B - Nome:** Nome completo do cliente
- **C - Telefone:** Telefone com DDD (ex: 62981912294)
- **D - Email:** Email do cliente
- **E - Unidade:** "Parque Amazônia" ou "Vila Rosa"
- **F - Quadra:** Nome da quadra (ex: "Quadra 01", "Q1")
- **G - Modalidade:** Futevôlei, Vôlei, Beach Tennis ou Tênis
- **H - Data:** Data da reserva (ex: 10/10/2025)
- **I - Horário:** Horário da reserva (ex: 14:00)
- **J - Observações:** Observações do cliente (opcional)
- **K - Status:** "Pendente", "Confirmado", "Cancelado"

**Exemplo de linha:**
```
08/10/2025 14:30 | Breno Araujo | 62981912294 | breno@email.com | Parque Amazônia | Quadra 01 | Futevôlei | 10/10/2025 | 14:00 | Primeira vez | Pendente
```

---

## ABA 2: "leads" (Aulas Experimentais)

**Descrição:** Armazena os leads de aulas experimentais cadastrados pelo formulário público.

**Colunas:**
- **A - Data/Hora:** Timestamp do cadastro
- **B - Nome:** Nome completo do interessado
- **C - Telefone:** Telefone com DDD
- **D - Email:** Email do interessado
- **E - Modalidade:** Futevôlei, Vôlei, Beach Tennis ou Tênis
- **F - Nível:** "Iniciante", "Intermediário" ou "Avançado"
- **G - Observações:** Observações do interessado (opcional)
- **H - Status:** "Novo", "Contatado", "Agendado", "Convertido"

**Exemplo de linha:**
```
08/10/2025 11:20 | Maria Silva | 62999887766 | maria@email.com | Vôlei | Iniciante | Quero conhecer | Novo
```

---

## ABA 3: "Clientes"

**Descrição:** Lista completa de clientes cadastrados no sistema.

**Colunas:**
- **A - ID:** Identificador único (ex: 1, 2, 3...)
- **B - Nome:** Nome completo do cliente
- **C - Email:** Email do cliente
- **D - Telefone:** Telefone com DDD
- **E - Data Cadastro:** Data de cadastro (ex: 01/01/2025)
- **F - Total Reservas:** Número total de reservas (ex: 15)
- **G - Total Gasto:** Valor total gasto (ex: 1200.00)
- **H - Status:** "Ativo" ou "Inativo"

**Exemplo de linha:**
```
1 | João Silva | joao@email.com | 62988776655 | 01/01/2025 | 15 | 1200.00 | Ativo
```

---

## ABA 4: "Professores"

**Descrição:** Lista de professores cadastrados no sistema.

**Colunas:**
- **A - ID:** Identificador único
- **B - Nome:** Nome completo do professor
- **C - Email:** Email do professor
- **D - Telefone:** Telefone com DDD
- **E - Especialidade:** Modalidade principal (ex: Futevôlei, Vôlei)
- **F - Avaliação:** Nota média (ex: 4.8)
- **G - Total Alunos:** Número de alunos (ex: 25)
- **H - Status:** "Ativo" ou "Inativo"

**Exemplo de linha:**
```
1 | Carlos Silva | carlos@arena.com | 62977665544 | Futevôlei | 4.8 | 25 | Ativo
```

---

## ABA 5: "Quadras"

**Descrição:** Lista de quadras disponíveis nas duas unidades.

**Colunas:**
- **A - ID:** Identificador único
- **B - Nome:** Nome da quadra (ex: "Quadra 01", "Q1")
- **C - Unidade:** "Parque Amazônia" ou "Vila Rosa"
- **D - Modalidade:** Tipo de esporte
- **E - Preço/Hora:** Valor por hora (ex: 80.00)
- **F - Descrição:** Descrição da quadra
- **G - Status:** "Ativa" ou "Inativa"

**Exemplo de linha:**
```
1 | Quadra 01 | Parque Amazônia | Futevôlei | 80.00 | Quadra coberta com grama sintética | Ativa
```

**Lista completa esperada:**
- Parque Amazônia: Quadra 01, 02, 03, 04, 05 (R$ 80/h)
- Vila Rosa: Q1, Q2, Q3, Q4 (R$ 70/h)

---

## ABA 6: "Pagamentos"

**Descrição:** Registro de pagamentos realizados.

**Colunas:**
- **A - ID:** Identificador único
- **B - Data:** Data do pagamento
- **C - Cliente:** Nome do cliente
- **D - Valor:** Valor pago (ex: 80.00)
- **E - Método:** "PIX", "Dinheiro", "Cartão"
- **F - Referência:** Número da reserva ou descrição
- **G - Status:** "Pago", "Pendente", "Cancelado"

**Exemplo de linha:**
```
1 | 08/10/2025 | João Silva | 80.00 | PIX | Reserva Quadra 01 - 14:00 | Pago
```

---

## ABA 7: "reservas" (Reservas do Dashboard Admin)

**Descrição:** Reservas criadas pelo administrador no dashboard (diferente das reservas públicas).

**Colunas:**
- **A - ID:** Identificador único
- **B - Data/Hora Criação:** Timestamp
- **C - Cliente:** Nome do cliente
- **D - Quadra:** Nome da quadra
- **E - Professor:** Nome do professor (opcional)
- **F - Data:** Data da reserva
- **G - Horário:** Horário da reserva
- **H - Valor:** Valor da reserva
- **I - Status:** "Confirmada", "Pendente", "Cancelada"

**Exemplo de linha:**
```
1 | 08/10/2025 10:00 | Maria Santos | Quadra 02 | Carlos Silva | 10/10/2025 | 15:00 | 80.00 | Confirmada
```

---

## RESUMO DAS ABAS NECESSÁRIAS

1. **"Página1"** - Reservas do formulário público
2. **"leads"** - Aulas experimentais
3. **"Clientes"** - Lista de clientes
4. **"Professores"** - Lista de professores
5. **"Quadras"** - Lista de quadras
6. **"Pagamentos"** - Registro de pagamentos
7. **"reservas"** - Reservas do dashboard admin

---

## CONFIGURAÇÃO DAS CHAVES PIX

**Unidade Parque Amazônia:** 12345678
**Unidade Vila Rosa:** 87654321

---

## NOTAS IMPORTANTES

1. **Primeira linha:** Sempre use a primeira linha para os cabeçalhos das colunas
2. **Formato de data:** Use DD/MM/AAAA (ex: 08/10/2025)
3. **Formato de hora:** Use HH:MM (ex: 14:00)
4. **Valores monetários:** Use ponto como separador decimal (ex: 80.00)
5. **Status:** Mantenha consistência nos valores de status
6. **Telefones:** Sempre com DDD, sem formatação especial

---

## INTEGRAÇÃO ATUAL

**Componentes conectados ao Google Sheets:**
- Formulário de Aula Experimental → aba "leads"
- Formulário de Reserva de Quadra → aba "Página1"
- Calendário de Reservas → aba "reservas"
- Lista de Clientes → aba "Clientes"
- Lista de Professores → aba "Professores"
- Lista de Quadras → aba "Quadras"
- Lista de Pagamentos → aba "Pagamentos"
- Gráficos Financeiros → dados calculados
- Gráfico de Ocupação → dados calculados

**Status:** 100% conectado ao Google Sheets!

---

*Documento criado para Arena Coligados - Janeiro 2025*
