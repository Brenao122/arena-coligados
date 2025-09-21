/**
 * HIERARQUIA DE USUÁRIOS - ARENA COLIGADOS
 *
 * 1. ADMINISTRADOR (admin)
 *    - Acesso completo ao sistema
 *    - Dashboard: Visão geral com todas as métricas
 *    - Funcionalidades:
 *      ✅ Gerenciar quadras (criar, editar, desativar)
 *      ✅ Gerenciar professores (contratar, demitir, horários)
 *      ✅ Gerenciar clientes (visualizar, editar, histórico)
 *      ✅ Gerenciar reservas (todas as reservas)
 *      ✅ Relatórios financeiros completos
 *      ✅ Configurações do sistema
 *      ✅ Integrações (WhatsApp, Instagram, Pagamentos)
 *      ✅ Leads e conversões
 *      ✅ Pagamentos e cobrança
 *
 * 2. PROFESSOR (professor)
 *    - Acesso focado em gestão de aulas e alunos
 *    - Dashboard: Métricas de suas aulas e alunos
 *    - Funcionalidades:
 *      ✅ Visualizar suas aulas agendadas
 *      ✅ Gerenciar disponibilidade pessoal
 *      ✅ Visualizar alunos das suas aulas
 *      ✅ Marcar presença/falta
 *      ✅ Relatórios das suas aulas
 *      ❌ Não pode gerenciar outros professores
 *      ❌ Não pode alterar preços
 *      ❌ Não pode acessar relatórios financeiros
 *      ❌ Não pode gerenciar quadras
 *
 * 3. ALUNO/CLIENTE (cliente)
 *    - Acesso limitado para visualizar suas informações
 *    - Dashboard: Progresso pessoal e próximas aulas
 *    - Funcionalidades:
 *      ✅ Visualizar suas reservas/aulas
 *      ✅ Histórico de aulas
 *      ✅ Dados pessoais (editar perfil)
 *      ✅ Pagamentos pessoais
 *      ❌ Não pode ver outros alunos
 *      ❌ Não pode gerenciar nada do sistema
 *      ❌ Não pode acessar relatórios
 *      ❌ Não pode ver informações financeiras gerais
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
