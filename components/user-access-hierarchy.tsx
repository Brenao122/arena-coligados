/**
 * HIERARQUIA DE USUÃRIOS - ARENA COLIGADOS
 *
 * 1. ADMINISTRADOR (admin)
 *    - Acesso completo ao sistema
 *    - Dashboard: VisÃ£o geral com todas as mÃ©tricas
 *    - Funcionalidades:
 *      âœ… Gerenciar quadras (criar, editar, desativar)
 *      âœ… Gerenciar professores (contratar, demitir, horÃ¡rios)
 *      âœ… Gerenciar clientes (visualizar, editar, histÃ³rico)
 *      âœ… Gerenciar reservas (todas as reservas)
 *      âœ… RelatÃ³rios financeiros completos
 *      âœ… ConfiguraÃ§Ãµes do sistema
 *      âœ… IntegraÃ§Ãµes (WhatsApp, Instagram, Pagamentos)
 *      âœ… Leads e conversÃµes
 *      âœ… Pagamentos e cobranÃ§a
 *
 * 2. PROFESSOR (professor)
 *    - Acesso focado em gestÃ£o de aulas e alunos
 *    - Dashboard: MÃ©tricas de suas aulas e alunos
 *    - Funcionalidades:
 *      âœ… Visualizar suas aulas agendadas
 *      âœ… Gerenciar disponibilidade pessoal
 *      âœ… Visualizar alunos das suas aulas
 *      âœ… Marcar presenÃ§a/falta
 *      âœ… RelatÃ³rios das suas aulas
 *      âŒ NÃ£o pode gerenciar outros professores
 *      âŒ NÃ£o pode alterar preÃ§os
 *      âŒ NÃ£o pode acessar relatÃ³rios financeiros
 *      âŒ NÃ£o pode gerenciar quadras
 *
 * 3. ALUNO/CLIENTE (cliente)
 *    - Acesso limitado para visualizar suas informaÃ§Ãµes
 *    - Dashboard: Progresso pessoal e prÃ³ximas aulas
 *    - Funcionalidades:
 *      âœ… Visualizar suas reservas/aulas
 *      âœ… HistÃ³rico de aulas
 *      âœ… Dados pessoais (editar perfil)
 *      âœ… Pagamentos pessoais
 *      âŒ NÃ£o pode ver outros alunos
 *      âŒ NÃ£o pode gerenciar nada do sistema
 *      âŒ NÃ£o pode acessar relatÃ³rios
 *      âŒ NÃ£o pode ver informaÃ§Ãµes financeiras gerais
 */

export const USER_PERMISSIONS = {
  admin: {
    dashboard: true,
    reservas: { view: true, create: true, edit: true, delete: true },
    quadras: { view: true, create: true, edit: true, delete: true },
    clientes: { view: true, create: true, edit: true, delete: true },
    professores: { view: true, create: true, edit: true, delete: true },
    pagamentos: { view: true, manage: true },
    leads: { view: true, manage: true },
    relatorios: { view: true, financial: true },
    configuracoes: { view: true, manage: true },
  },
  professor: {
    dashboard: true,
    reservas: { view: "own", create: false, edit: "own", delete: false },
    quadras: { view: true, create: false, edit: false, delete: false },
    clientes: { view: "students", create: false, edit: false, delete: false },
    professores: { view: "self", create: false, edit: "self", delete: false },
    pagamentos: { view: "own", manage: false },
    leads: { view: false, manage: false },
    relatorios: { view: "own", financial: false },
    configuracoes: { view: false, manage: false },
  },
  cliente: {
    dashboard: true,
    reservas: { view: "own", create: false, edit: false, delete: false },
    quadras: { view: true, create: false, edit: false, delete: false },
    clientes: { view: "self", create: false, edit: "self", delete: false },
    professores: { view: "assigned", create: false, edit: false, delete: false },
    pagamentos: { view: "own", manage: false },
    leads: { view: false, manage: false },
    relatorios: { view: false, financial: false },
    configuracoes: { view: false, manage: false },
  },
} as const

