/**
 * HIERARQUIA DE USUÃRIOS - ARENA COLIGADOS
 *
 * 1. ADMINISTRADOR (admin)
 *    - Acesso completo ao sistema
 *    - Dashboard: Visão geral com todas as métricas
 *    - Funcionalidades:
 *      âœ… Gerenciar quadras (criar, editar, desativar)
 *      âœ… Gerenciar professores (contratar, demitir, horários)
 *      âœ… Gerenciar clientes (visualizar, editar, histórico)
 *      âœ… Gerenciar reservas (todas as reservas)
 *      âœ… Relatórios financeiros completos
 *      âœ… ConfiguraçÃµes do sistema
 *      âœ… IntegraçÃµes (WhatsApp, Instagram, Pagamentos)
 *      âœ… Leads e conversÃµes
 *      âœ… Pagamentos e cobrança
 *
 * 2. PROFESSOR (professor)
 *    - Acesso focado em gestão de aulas e alunos
 *    - Dashboard: Métricas de suas aulas e alunos
 *    - Funcionalidades:
 *      âœ… Visualizar suas aulas agendadas
 *      âœ… Gerenciar disponibilidade pessoal
 *      âœ… Visualizar alunos das suas aulas
 *      âœ… Marcar presença/falta
 *      âœ… Relatórios das suas aulas
 *      âŒ Não pode gerenciar outros professores
 *      âŒ Não pode alterar preços
 *      âŒ Não pode acessar relatórios financeiros
 *      âŒ Não pode gerenciar quadras
 *
 * 3. ALUNO/CLIENTE (cliente)
 *    - Acesso limitado para visualizar suas informaçÃµes
 *    - Dashboard: Progresso pessoal e próximas aulas
 *    - Funcionalidades:
 *      âœ… Visualizar suas reservas/aulas
 *      âœ… Histórico de aulas
 *      âœ… Dados pessoais (editar perfil)
 *      âœ… Pagamentos pessoais
 *      âŒ Não pode ver outros alunos
 *      âŒ Não pode gerenciar nada do sistema
 *      âŒ Não pode acessar relatórios
 *      âŒ Não pode ver informaçÃµes financeiras gerais
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

