#!/usr/bin/env node

/**
 * Script para Criar Dados Mockados - Arena Coligados
 * Este script cria dados estruturados para demonstração
 */

const fs = require('fs')
const path = require('path')

console.log('🏟️  ARENA COLIGADOS - CRIANDO DADOS MOCKADOS')
console.log('==============================================\n')

// Dados das Quadras
const quadras = [
  {
    id: 'quadra-matriz-1',
    nome: 'Quadra 1 - Matriz',
    tipo: 'Beach Tennis',
    capacidade: 6,
    preco_hora: 80,
    ativa: true,
    descricao: 'Quadra de Beach Tennis com areia premium',
    regras: 'Capacidade máxima de 6 pessoas',
    equipamentos: ['Rede oficial', 'Raquetes', 'Bolas'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quadra-matriz-2',
    nome: 'Quadra 2 - Matriz',
    tipo: 'Vôlei',
    capacidade: 10,
    preco_hora: 80,
    ativa: true,
    descricao: 'Quadra de Vôlei com piso profissional',
    regras: 'Capacidade máxima de 10 pessoas',
    equipamentos: ['Rede oficial', 'Bolas oficiais'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quadra-matriz-3',
    nome: 'Quadra 3 - Matriz',
    tipo: 'Futevôlei',
    capacidade: 10,
    preco_hora: 80,
    ativa: true,
    descricao: 'Quadra de Futevôlei com areia especial',
    regras: 'Capacidade máxima de 10 pessoas',
    equipamentos: ['Rede regulamentada', 'Bolas oficiais'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quadra-matriz-4',
    nome: 'Quadra 4 - Matriz',
    tipo: 'Beach Tennis',
    capacidade: 6,
    preco_hora: 80,
    ativa: true,
    descricao: 'Quadra de Beach Tennis - Matriz',
    regras: 'Capacidade máxima de 6 pessoas',
    equipamentos: ['Rede oficial', 'Raquetes'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quadra-matriz-5',
    nome: 'Quadra 5 - Matriz',
    tipo: 'Vôlei',
    capacidade: 10,
    preco_hora: 80,
    ativa: true,
    descricao: 'Quadra de Vôlei - Matriz',
    regras: 'Capacidade máxima de 10 pessoas',
    equipamentos: ['Rede oficial', 'Bolas'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quadra-vila-rosa-1',
    nome: 'Quadra Vila Rosa 1',
    tipo: 'Beach Tennis',
    capacidade: 6,
    preco_hora: 70,
    ativa: true,
    descricao: 'Quadra de Beach Tennis - Vila Rosa',
    regras: 'Capacidade máxima de 6 pessoas',
    equipamentos: ['Rede oficial', 'Raquetes'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quadra-vila-rosa-2',
    nome: 'Quadra Vila Rosa 2',
    tipo: 'Vôlei',
    capacidade: 10,
    preco_hora: 70,
    ativa: true,
    descricao: 'Quadra de Vôlei - Vila Rosa',
    regras: 'Capacidade máxima de 10 pessoas',
    equipamentos: ['Rede oficial', 'Bolas'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Dados dos Clientes
const clientes = [
  {
    id: 'cliente-001',
    email: 'joao.silva@email.com',
    nome: 'João Silva Santos',
    telefone: '(62) 99999-1111',
    data_nascimento: '1990-05-15',
    endereco: {
      rua: 'Rua das Flores, 123',
      bairro: 'Centro',
      cidade: 'Goiânia',
      estado: 'GO',
      cep: '74000-000'
    },
    role: 'cliente',
    ativo: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: 'cliente-002',
    email: 'maria.santos@email.com',
    nome: 'Maria Santos Oliveira',
    telefone: '(62) 99999-2222',
    data_nascimento: '1985-08-22',
    endereco: {
      rua: 'Av. Goiás, 456',
      bairro: 'Setor Oeste',
      cidade: 'Goiânia',
      estado: 'GO',
      cep: '74100-000'
    },
    role: 'cliente',
    ativo: true,
    created_at: '2024-02-10T14:30:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: 'cliente-003',
    email: 'carlos.lima@email.com',
    nome: 'Carlos Eduardo Lima',
    telefone: '(62) 99999-3333',
    data_nascimento: '1992-12-03',
    endereco: {
      rua: 'Rua 7, 789',
      bairro: 'Setor Marista',
      cidade: 'Goiânia',
      estado: 'GO',
      cep: '74200-000'
    },
    role: 'cliente',
    ativo: true,
    created_at: '2024-03-05T09:15:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: 'cliente-004',
    email: 'ana.costa@email.com',
    nome: 'Ana Paula Costa',
    telefone: '(62) 99999-4444',
    data_nascimento: '1988-07-18',
    endereco: {
      rua: 'Av. T-10, 321',
      bairro: 'Setor Bueno',
      cidade: 'Goiânia',
      estado: 'GO',
      cep: '74300-000'
    },
    role: 'cliente',
    ativo: true,
    created_at: '2024-03-20T16:45:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: 'professor-001',
    email: 'rafael.professor@arenacoligados.com.br',
    nome: 'Rafael Henrique Professor',
    telefone: '(62) 99999-5555',
    data_nascimento: '1980-04-12',
    endereco: {
      rua: 'Rua das Palmeiras, 654',
      bairro: 'Jardim América',
      cidade: 'Goiânia',
      estado: 'GO',
      cep: '74400-000'
    },
    role: 'professor',
    ativo: true,
    created_at: '2024-01-01T08:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: 'admin-001',
    email: 'admin@arenacoligados.com.br',
    nome: 'Administrador Arena',
    telefone: '(62) 99999-0000',
    data_nascimento: '1985-01-01',
    endereco: {
      rua: 'Arena Coligados',
      bairro: 'Av. Xingu',
      cidade: 'Goiânia',
      estado: 'GO',
      cep: '74840-740'
    },
    role: 'admin',
    ativo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: new Date().toISOString()
  }
]

// Gerar Reservas
const reservas = []
const hoje = new Date()

for (let i = 0; i < 30; i++) {
  const dataReserva = new Date(hoje.getTime() + (i * 24 * 60 * 60 * 1000))
  const horaInicio = 8 + Math.floor(Math.random() * 12) // Entre 8h e 19h
  const horaFim = horaInicio + 1 + Math.floor(Math.random() * 3) // Entre 1h e 4h de duração
  
  const quadraEscolhida = quadras[Math.floor(Math.random() * quadras.length)]
  const clienteEscolhido = clientes.filter(c => c.role === 'cliente')[Math.floor(Math.random() * 4)]
  const tipos = ['Aula', 'Particular', 'Campeonato', 'Treino']
  const status = ['confirmada', 'pendente', 'cancelada']
  
  const tipoEscolhido = tipos[Math.floor(Math.random() * tipos.length)]
  const statusEscolhido = status[Math.floor(Math.random() * status.length)]
  
  const valorTotal = (horaFim - horaInicio) * quadraEscolhida.preco_hora
  
  const dataInicio = new Date(dataReserva)
  dataInicio.setHours(horaInicio, 0, 0, 0)
  
  const dataFim = new Date(dataReserva)
  dataFim.setHours(horaFim, 0, 0, 0)
  
  reservas.push({
    id: `reserva-${String(i + 1).padStart(3, '0')}`,
    cliente_id: clienteEscolhido.id,
    quadra_id: quadraEscolhida.id,
    professor_id: tipoEscolhido === 'Aula' ? 'professor-001' : null,
    tipo: tipoEscolhido,
    data_inicio: dataInicio.toISOString(),
    data_fim: dataFim.toISOString(),
    valor_total: valorTotal,
    status: statusEscolhido,
    observacoes: `${tipoEscolhido} na ${quadraEscolhida.nome}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
}

// Dados dos Leads
const leads = [
  {
    id: 'lead-001',
    nome: 'Pedro Henrique Silva',
    email: 'pedro.henrique@email.com',
    telefone: '(62) 99999-6666',
    interesse: 'Beach Tennis',
    origem: 'Instagram',
    status: 'novo',
    observacoes: 'Interessado em aulas de Beach Tennis',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-002',
    nome: 'Ana Beatriz Santos',
    email: 'ana.beatriz@email.com',
    telefone: '(62) 99999-7777',
    interesse: 'Vôlei',
    origem: 'WhatsApp',
    status: 'contatado',
    observacoes: 'Já foi contatada, aguardando resposta',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-003',
    nome: 'Lucas Oliveira',
    email: 'lucas.oliveira@email.com',
    telefone: '(62) 99999-8888',
    interesse: 'Futevôlei',
    origem: 'Google',
    status: 'qualificado',
    observacoes: 'Muito interessado, quer agendar aula experimental',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-004',
    nome: 'Fernanda Costa',
    email: 'fernanda.costa@email.com',
    telefone: '(62) 99999-9999',
    interesse: 'Beach Tennis',
    origem: 'Indicação',
    status: 'convertido',
    observacoes: 'Convertido em cliente - reserva realizada',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-005',
    nome: 'Roberto Alves',
    email: 'roberto.alves@email.com',
    telefone: '(62) 99999-0001',
    interesse: 'Vôlei',
    origem: 'Facebook',
    status: 'novo',
    observacoes: 'Interessado em jogar vôlei com amigos',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Função para salvar dados em arquivo JSON
function salvarDados(nomeArquivo, dados) {
  try {
    const caminho = path.join(__dirname, '..', 'data', nomeArquivo)
    const diretorio = path.dirname(caminho)
    
    // Criar diretório se não existir
    if (!fs.existsSync(diretorio)) {
      fs.mkdirSync(diretorio, { recursive: true })
    }
    
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2))
    console.log(`✅ ${nomeArquivo} - ${dados.length} registros`)
    return true
  } catch (error) {
    console.error(`❌ Erro ao salvar ${nomeArquivo}:`, error.message)
    return false
  }
}

// Função para criar arquivo de configuração
function criarConfig() {
  const config = {
    database: {
      supabase_url: 'https://fogtbptqvvhoqesljlen.supabase.co',
      supabase_anon_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ3RicHRxdnZob3Flc2xqbGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU5NjgsImV4cCI6MjA3MzExMTk2OH0.Fi0L_3mnpbjZFGqLvf_peDq5XkiDtiwF0vfn6nMDfg8'
    },
    google_sheets: {
      spreadsheet_id: '174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew',
      service_account_email: 'your-service-account@your-project.iam.gserviceaccount.com',
      private_key: 'your-private-key-here'
    },
    arena: {
      nome: 'Arena Coligados',
      unidades: ['Matriz', 'Vila Rosa'],
      modalidades: ['Beach Tennis', 'Vôlei', 'Futevôlei'],
      precos: {
        matriz: 80,
        vila_rosa: 70
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  try {
    const caminho = path.join(__dirname, '..', 'data', 'config.json')
    fs.writeFileSync(caminho, JSON.stringify(config, null, 2))
    console.log('✅ config.json - Configurações criadas')
    return true
  } catch (error) {
    console.error('❌ Erro ao salvar config.json:', error.message)
    return false
  }
}

// Função principal
async function criarDadosMockados() {
  console.log('🚀 Criando dados mockados...\n')
  
  const resultados = {}
  
  // Salvar todos os dados
  resultados.quadras = salvarDados('quadras.json', quadras)
  resultados.clientes = salvarDados('clientes.json', clientes)
  resultados.reservas = salvarDados('reservas.json', reservas)
  resultados.leads = salvarDados('leads.json', leads)
  resultados.config = criarConfig()
  
  // Calcular estatísticas
  const totalReservas = reservas.length
  const reservasConfirmadas = reservas.filter(r => r.status === 'confirmada').length
  const receitaTotal = reservas.filter(r => r.status === 'confirmada').reduce((total, r) => total + r.valor_total, 0)
  const clientesAtivos = clientes.filter(c => c.ativo).length
  
  // Resumo final
  console.log('\n🎉 DADOS MOCKADOS CRIADOS COM SUCESSO!')
  console.log('=====================================')
  console.log('')
  console.log('📊 RESUMO DOS DADOS:')
  console.log(`   🏟️  Quadras: ${quadras.length}`)
  console.log(`   👥 Clientes: ${clientesAtivos}`)
  console.log(`   📅 Reservas: ${totalReservas} (${reservasConfirmadas} confirmadas)`)
  console.log(`   🎯 Leads: ${leads.length}`)
  console.log(`   💰 Receita Total: R$ ${receitaTotal.toLocaleString('pt-BR')}`)
  console.log('')
  console.log('📁 Arquivos criados em: /data/')
  console.log('   - quadras.json')
  console.log('   - clientes.json')
  console.log('   - reservas.json')
  console.log('   - leads.json')
  console.log('   - config.json')
  console.log('')
  console.log('🔗 PRÓXIMOS PASSOS:')
  console.log('1. Configure as credenciais do Google Sheets no config.json')
  console.log('2. Execute: node scripts/populate-google-sheets.js')
  console.log('3. Ou use os dados diretamente no Supabase')
  console.log('')
  console.log('👤 USUÁRIOS DE TESTE:')
  console.log('   Admin: admin@arenacoligados.com.br')
  console.log('   Professor: rafael.professor@arenacoligados.com.br')
  console.log('   Cliente: joao.silva@email.com')
  console.log('')
  console.log('✅ Dados prontos para usar na plataforma!')
}

// Executar
criarDadosMockados()



