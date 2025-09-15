#!/usr/bin/env node

/**
 * Script para Popular o Banco de Dados - Arena Coligados
 * Este script verifica as tabelas e popula com dados de exemplo
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fogtbptqvvhoqesljlen.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ3RicHRxdnZob3Flc2xqbGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU5NjgsImV4cCI6MjA3MzExMTk2OH0.Fi0L_3mnpbjZFGqLvf_peDq5XkiDtiwF0vfn6nMDfg8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🏟️  ARENA COLIGADOS - POPULANDO BANCO DE DADOS')
console.log('===============================================\n')

// Dados de exemplo para quadras
const quadrasExemplo = [
  {
    id: 'quadra-1',
    nome: 'Quadra 1 - Matriz',
    tipo: 'Beach Tennis',
    capacidade: 6,
    preco_hora: 80,
    descricao: 'Quadra de Beach Tennis com areia premium',
    regras: 'Capacidade máxima de 6 pessoas',
    equipamentos: ['Rede oficial', 'Raquetes', 'Bolas'],
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quadra-2',
    nome: 'Quadra 2 - Matriz',
    tipo: 'Vôlei',
    capacidade: 10,
    preco_hora: 80,
    descricao: 'Quadra de Vôlei com piso profissional',
    regras: 'Capacidade máxima de 10 pessoas',
    equipamentos: ['Rede oficial', 'Bolas oficiais'],
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quadra-3',
    nome: 'Quadra 3 - Matriz',
    tipo: 'Futevôlei',
    capacidade: 10,
    preco_hora: 80,
    descricao: 'Quadra de Futevôlei com areia especial',
    regras: 'Capacidade máxima de 10 pessoas',
    equipamentos: ['Rede regulamentada', 'Bolas oficiais'],
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quadra-4',
    nome: 'Quadra Vila Rosa 1',
    tipo: 'Beach Tennis',
    capacidade: 6,
    preco_hora: 70,
    descricao: 'Quadra de Beach Tennis - Vila Rosa',
    regras: 'Capacidade máxima de 6 pessoas',
    equipamentos: ['Rede oficial', 'Raquetes'],
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'quadra-5',
    nome: 'Quadra Vila Rosa 2',
    tipo: 'Vôlei',
    capacidade: 10,
    preco_hora: 70,
    descricao: 'Quadra de Vôlei - Vila Rosa',
    regras: 'Capacidade máxima de 10 pessoas',
    equipamentos: ['Rede oficial', 'Bolas'],
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Dados de exemplo para clientes
const clientesExemplo = [
  {
    id: 'cliente-1',
    email: 'joao.silva@email.com',
    nome: 'João Silva',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cliente-2',
    email: 'maria.santos@email.com',
    nome: 'Maria Santos',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'admin-1',
    email: 'admin@arenacoligados.com.br',
    nome: 'Administrador Arena',
    telefone: '(62) 99999-0000',
    role: 'admin',
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'professor-1',
    email: 'professor@arenacoligados.com.br',
    nome: 'Carlos Professor',
    telefone: '(62) 99999-3333',
    role: 'professor',
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Dados de exemplo para reservas
const reservasExemplo = [
  {
    id: 'reserva-1',
    cliente_id: 'cliente-1',
    quadra_id: 'quadra-1',
    professor_id: 'professor-1',
    tipo: 'Aula',
    data_inicio: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Amanhã
    data_fim: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // Amanhã + 2h
    valor_total: 160,
    status: 'confirmada',
    observacoes: 'Aula de Beach Tennis',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'reserva-2',
    cliente_id: 'cliente-2',
    quadra_id: 'quadra-2',
    professor_id: null,
    tipo: 'Particular',
    data_inicio: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Depois de amanhã
    data_fim: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    valor_total: 160,
    status: 'confirmada',
    observacoes: 'Jogo particular de vôlei',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Dados de exemplo para leads
const leadsExemplo = [
  {
    id: 'lead-1',
    nome: 'Pedro Lead',
    email: 'pedro@email.com',
    telefone: '(62) 99999-4444',
    interesse: 'Beach Tennis',
    origem: 'Instagram',
    status: 'novo',
    observacoes: 'Interessado em aulas de Beach Tennis',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lead-2',
    nome: 'Ana Lead',
    email: 'ana@email.com',
    telefone: '(62) 99999-5555',
    interesse: 'Vôlei',
    origem: 'WhatsApp',
    status: 'contatado',
    observacoes: 'Já foi contatada, aguardando resposta',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Função para popular tabela
async function popularTabela(nomeTabela, dados, descricao) {
  try {
    console.log(`🔄 ${descricao}...`)
    
    // Primeiro, verificar se já existem dados
    const { data: dadosExistentes } = await supabase
      .from(nomeTabela)
      .select('id')
      .limit(1)
    
    if (dadosExistentes && dadosExistentes.length > 0) {
      console.log(`ℹ️  Tabela ${nomeTabela} já possui dados, pulando...`)
      return { success: true, skipped: true }
    }
    
    // Inserir dados
    const { data, error } = await supabase
      .from(nomeTabela)
      .insert(dados)
    
    if (error) {
      console.error(`❌ Erro ao popular ${nomeTabela}:`, error.message)
      return { success: false, error: error.message }
    }
    
    console.log(`✅ ${descricao} - ${dados.length} registros inseridos`)
    return { success: true, count: dados.length }
    
  } catch (error) {
    console.error(`❌ Erro ao popular ${nomeTabela}:`, error.message)
    return { success: false, error: error.message }
  }
}

// Função para verificar conexão
async function verificarConexao() {
  try {
    console.log('🔍 Verificando conexão com Supabase...')
    
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro de conexão:', error.message)
      return false
    }
    
    console.log('✅ Conexão com Supabase estabelecida')
    return true
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message)
    return false
  }
}

// Função principal
async function popularBanco() {
  console.log('🚀 Iniciando popularização do banco de dados...\n')
  
  // Verificar conexão
  const conexaoOk = await verificarConexao()
  if (!conexaoOk) {
    console.error('❌ Não foi possível conectar ao Supabase. Verifique as credenciais.')
    process.exit(1)
  }
  
  console.log('')
  
  // Popular tabelas
  const resultados = {}
  
  resultados.profiles = await popularTabela('profiles', clientesExemplo, 'Populando clientes e usuários')
  resultados.quadras = await popularTabela('quadras', quadrasExemplo, 'Populando quadras')
  resultados.reservas = await popularTabela('reservas', reservasExemplo, 'Populando reservas')
  resultados.leads = await popularTabela('leads', leadsExemplo, 'Populando leads')
  
  // Resumo final
  console.log('\n🎉 POPULARIZAÇÃO CONCLUÍDA!')
  console.log('===========================')
  
  let totalInseridos = 0
  let totalPulados = 0
  let totalErros = 0
  
  Object.entries(resultados).forEach(([tabela, resultado]) => {
    if (resultado.success) {
      if (resultado.skipped) {
        console.log(`✅ ${tabela}: Já possuía dados`)
        totalPulados++
      } else {
        console.log(`✅ ${tabela}: ${resultado.count} registros inseridos`)
        totalInseridos += resultado.count
      }
    } else {
      console.log(`❌ ${tabela}: Erro - ${resultado.error}`)
      totalErros++
    }
  })
  
  console.log('')
  console.log(`📊 RESUMO:`)
  console.log(`   ✅ Registros inseridos: ${totalInseridos}`)
  console.log(`   ℹ️  Tabelas que já tinham dados: ${totalPulados}`)
  console.log(`   ❌ Erros: ${totalErros}`)
  console.log('')
  console.log('🚀 Agora você pode acessar a plataforma e ver os dados!')
  console.log('   Acesse: http://localhost:3000')
  console.log('')
  console.log('👤 USUÁRIOS DE TESTE:')
  console.log('   Admin: admin@arenacoligados.com.br')
  console.log('   Professor: professor@arenacoligados.com.br')
  console.log('   Cliente: joao.silva@email.com')
}

// Executar
popularBanco().catch(error => {
  console.error('❌ Erro durante a popularização:', error)
  process.exit(1)
})

