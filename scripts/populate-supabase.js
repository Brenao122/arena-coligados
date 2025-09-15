#!/usr/bin/env node

/**
 * Script para Popular Supabase - Arena Coligados
 * Este script popula o Supabase com dados estruturados
 */

const fs = require('fs')
const path = require('path')

console.log('🏟️  ARENA COLIGADOS - POPULANDO SUPABASE')
console.log('==========================================\n')

// Configurações do Supabase
const SUPABASE_URL = 'https://fogtbptqvvhoqesljlen.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ3RicHRxdnZob3Flc2xqbGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU5NjgsImV4cCI6MjA3MzExMTk2OH0.Fi0L_3mnpbjZFGqLvf_peDq5XkiDtiwF0vfn6nMDfg8'

// Função para fazer requisições HTTP
async function fazerRequisicao(endpoint, metodo = 'GET', dados = null) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`
    
    const opcoes = {
      method: metodo,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    }
    
    if (dados && (metodo === 'POST' || metodo === 'PUT' || metodo === 'PATCH')) {
      opcoes.body = JSON.stringify(dados)
    }
    
    const resposta = await fetch(url, opcoes)
    
    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`)
    }
    
    const resultado = await resposta.json()
    return { ok: true, data: resultado }
  } catch (error) {
    console.error(`❌ Erro na requisição ${endpoint}:`, error.message)
    return { ok: false, error: error.message }
  }
}

// Função para popular quadras
async function popularQuadras() {
  try {
    console.log('🏟️  Populando tabela quadras...')
    
    // Ler dados das quadras
    const caminhoQuadras = path.join(__dirname, '..', 'data', 'quadras.json')
    const quadrasData = JSON.parse(fs.readFileSync(caminhoQuadras, 'utf8'))
    
    // Limpar tabela existente
    await fazerRequisicao('quadras', 'DELETE')
    
    // Inserir novas quadras
    const resultado = await fazerRequisicao('quadras', 'POST', quadrasData)
    
    if (resultado.ok) {
      console.log(`✅ ${quadrasData.length} quadras inseridas`)
      return quadrasData.length
    } else {
      throw new Error(resultado.error)
    }
  } catch (error) {
    console.error('❌ Erro ao popular quadras:', error.message)
    throw error
  }
}

// Função para popular clientes
async function popularClientes() {
  try {
    console.log('👥 Populando tabela clientes...')
    
    // Ler dados dos clientes
    const caminhoClientes = path.join(__dirname, '..', 'data', 'clientes.json')
    const clientesData = JSON.parse(fs.readFileSync(caminhoClientes, 'utf8'))
    
    // Limpar tabela existente
    await fazerRequisicao('clientes', 'DELETE')
    
    // Inserir novos clientes
    const resultado = await fazerRequisicao('clientes', 'POST', clientesData)
    
    if (resultado.ok) {
      console.log(`✅ ${clientesData.length} clientes inseridos`)
      return clientesData.length
    } else {
      throw new Error(resultado.error)
    }
  } catch (error) {
    console.error('❌ Erro ao popular clientes:', error.message)
    throw error
  }
}

// Função para popular reservas
async function popularReservas() {
  try {
    console.log('📅 Populando tabela reservas...')
    
    // Ler dados das reservas
    const caminhoReservas = path.join(__dirname, '..', 'data', 'reservas.json')
    const reservasData = JSON.parse(fs.readFileSync(caminhoReservas, 'utf8'))
    
    // Limpar tabela existente
    await fazerRequisicao('reservas', 'DELETE')
    
    // Inserir novas reservas
    const resultado = await fazerRequisicao('reservas', 'POST', reservasData)
    
    if (resultado.ok) {
      console.log(`✅ ${reservasData.length} reservas inseridas`)
      return reservasData.length
    } else {
      throw new Error(resultado.error)
    }
  } catch (error) {
    console.error('❌ Erro ao popular reservas:', error.message)
    throw error
  }
}

// Função para popular leads
async function popularLeads() {
  try {
    console.log('🎯 Populando tabela leads...')
    
    // Ler dados dos leads
    const caminhoLeads = path.join(__dirname, '..', 'data', 'leads.json')
    const leadsData = JSON.parse(fs.readFileSync(caminhoLeads, 'utf8'))
    
    // Limpar tabela existente
    await fazerRequisicao('leads', 'DELETE')
    
    // Inserir novos leads
    const resultado = await fazerRequisicao('leads', 'POST', leadsData)
    
    if (resultado.ok) {
      console.log(`✅ ${leadsData.length} leads inseridos`)
      return leadsData.length
    } else {
      throw new Error(resultado.error)
    }
  } catch (error) {
    console.error('❌ Erro ao popular leads:', error.message)
    throw error
  }
}

// Função para verificar conexão
async function verificarConexao() {
  try {
    console.log('🔗 Verificando conexão com Supabase...')
    
    const resultado = await fazerRequisicao('quadras?select=count')
    
    if (resultado.ok) {
      console.log('✅ Conexão com Supabase estabelecida')
      return true
    } else {
      throw new Error(resultado.error)
    }
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message)
    return false
  }
}

// Função para gerar relatório final
async function gerarRelatorio(estatisticas) {
  try {
    console.log('\n📊 GERANDO RELATÓRIO FINAL...')
    
    // Buscar dados atualizados
    const [quadrasRes, clientesRes, reservasRes, leadsRes] = await Promise.all([
      fazerRequisicao('quadras?select=*'),
      fazerRequisicao('clientes?select=*'),
      fazerRequisicao('reservas?select=*'),
      fazerRequisicao('leads?select=*')
    ])
    
    const quadras = quadrasRes.ok ? quadrasRes.data : []
    const clientes = clientesRes.ok ? clientesRes.data : []
    const reservas = reservasRes.ok ? reservasRes.data : []
    const leads = leadsRes.ok ? leadsRes.data : []
    
    // Calcular estatísticas
    const totalReservas = reservas.length
    const reservasConfirmadas = reservas.filter(r => r.status === 'confirmada').length
    const receitaTotal = reservas.filter(r => r.status === 'confirmada').reduce((total, r) => total + (r.valor_total || 0), 0)
    const clientesAtivos = clientes.filter(c => c.ativo).length
    const quadrasAtivas = quadras.filter(q => q.ativa).length
    const leadsNovos = leads.filter(l => l.status === 'novo').length
    
    // Criar relatório
    const relatorio = {
      timestamp: new Date().toISOString(),
      estatisticas: {
        quadras: {
          total: quadras.length,
          ativas: quadrasAtivas,
          modalidades: [...new Set(quadras.map(q => q.tipo))]
        },
        clientes: {
          total: clientes.length,
          ativos: clientesAtivos,
          roles: clientes.reduce((acc, c) => {
            acc[c.role] = (acc[c.role] || 0) + 1
            return acc
          }, {})
        },
        reservas: {
          total: totalReservas,
          confirmadas: reservasConfirmadas,
          pendentes: reservas.filter(r => r.status === 'pendente').length,
          canceladas: reservas.filter(r => r.status === 'cancelada').length,
          receita_total: receitaTotal
        },
        leads: {
          total: leads.length,
          novos: leadsNovos,
          contatados: leads.filter(l => l.status === 'contatado').length,
          qualificados: leads.filter(l => l.status === 'qualificado').length,
          convertidos: leads.filter(l => l.status === 'convertido').length
        }
      },
      resumo: {
        data_populacao: new Date().toISOString(),
        total_registros: quadras.length + clientes.length + reservas.length + leads.length,
        receita_mensal_estimada: receitaTotal * 30, // Estimativa mensal
        taxa_conversao_leads: leads.length > 0 ? (leads.filter(l => l.status === 'convertido').length / leads.length * 100).toFixed(2) : 0
      }
    }
    
    // Salvar relatório
    const caminhoRelatorio = path.join(__dirname, '..', 'data', 'relatorio-populacao.json')
    fs.writeFileSync(caminhoRelatorio, JSON.stringify(relatorio, null, 2))
    
    console.log('✅ Relatório salvo em: /data/relatorio-populacao.json')
    
    return relatorio
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error.message)
    return null
  }
}

// Função principal
async function popularSupabase() {
  try {
    console.log('🚀 Iniciando população do Supabase...\n')
    
    // Verificar conexão
    const conectado = await verificarConexao()
    if (!conectado) {
      throw new Error('Não foi possível conectar ao Supabase')
    }
    
    console.log('')
    
    // Popular todas as tabelas
    const estatisticas = {}
    
    estatisticas.quadras = await popularQuadras()
    estatisticas.clientes = await popularClientes()
    estatisticas.reservas = await popularReservas()
    estatisticas.leads = await popularLeads()
    
    // Gerar relatório final
    const relatorio = await gerarRelatorio(estatisticas)
    
    // Resumo final
    console.log('\n🎉 SUPABASE POPULADO COM SUCESSO!')
    console.log('=================================')
    console.log('')
    console.log('📊 RESUMO:')
    console.log(`   🏟️  Quadras: ${estatisticas.quadras}`)
    console.log(`   👥 Clientes: ${estatisticas.clientes}`)
    console.log(`   📅 Reservas: ${estatisticas.reservas}`)
    console.log(`   🎯 Leads: ${estatisticas.leads}`)
    console.log('')
    
    if (relatorio) {
      console.log('💰 RECEITA TOTAL: R$', relatorio.estatisticas.reservas.receita_total.toLocaleString('pt-BR'))
      console.log('📈 RECEITA MENSAL ESTIMADA: R$', relatorio.resumo.receita_mensal_estimada.toLocaleString('pt-BR'))
      console.log('🎯 TAXA DE CONVERSÃO DE LEADS:', relatorio.resumo.taxa_conversao_leads + '%')
      console.log('')
    }
    
    console.log('🔗 DADOS DISPONÍVEIS:')
    console.log('   ✅ Quadras ativas e configuradas')
    console.log('   ✅ Clientes e usuários cadastrados')
    console.log('   ✅ Reservas para os próximos 30 dias')
    console.log('   ✅ Leads para conversão')
    console.log('')
    console.log('👤 USUÁRIOS DE TESTE:')
    console.log('   Admin: admin@arenacoligados.com.br')
    console.log('   Professor: rafael.professor@arenacoligados.com.br')
    console.log('   Cliente: joao.silva@email.com')
    console.log('')
    console.log('✅ AGORA VOCÊ PODE USAR A PLATAFORMA!')
    console.log('   Os dados estão disponíveis no Supabase')
    console.log('   Acesse: https://fogtbptqvvhoqesljlen.supabase.co')
    
  } catch (error) {
    console.error('❌ Erro ao popular Supabase:', error.message)
    console.log('')
    console.log('🔧 POSSÍVEIS SOLUÇÕES:')
    console.log('1. Verifique se o Supabase está ativo')
    console.log('2. Confirme se as credenciais estão corretas')
    console.log('3. Verifique se as tabelas existem no Supabase')
    console.log('4. Execute: node scripts/create-mock-data.js primeiro')
  }
}

// Executar
popularSupabase()

