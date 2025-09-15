#!/usr/bin/env node

/**
 * Script para Popular Supabase via APIs - Arena Coligados
 * Este script usa as APIs criadas para popular o Supabase
 */

const fs = require('fs')
const path = require('path')

console.log('🏟️  ARENA COLIGADOS - POPULANDO VIA APIs')
console.log('==========================================\n')

// URL base das APIs
const API_BASE = 'http://localhost:3000/api'

// Função para fazer requisições HTTP
async function fazerRequisicao(endpoint, metodo = 'GET', dados = null) {
  try {
    const url = `${API_BASE}${endpoint}`
    
    const opcoes = {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
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

// Função para popular quadras via API
async function popularQuadrasViaAPI() {
  try {
    console.log('🏟️  Populando quadras via API...')
    
    // Ler dados das quadras
    const caminhoQuadras = path.join(__dirname, '..', 'data', 'quadras.json')
    const quadrasData = JSON.parse(fs.readFileSync(caminhoQuadras, 'utf8'))
    
    let sucessos = 0
    
    for (const quadra of quadrasData) {
      const resultado = await fazerRequisicao('/quadras', 'POST', quadra)
      
      if (resultado.ok) {
        sucessos++
        console.log(`   ✅ ${quadra.nome}`)
      } else {
        console.log(`   ❌ ${quadra.nome}: ${resultado.error}`)
      }
    }
    
    console.log(`✅ ${sucessos}/${quadrasData.length} quadras inseridas`)
    return sucessos
  } catch (error) {
    console.error('❌ Erro ao popular quadras:', error.message)
    throw error
  }
}

// Função para popular clientes via API
async function popularClientesViaAPI() {
  try {
    console.log('👥 Populando clientes via API...')
    
    // Ler dados dos clientes
    const caminhoClientes = path.join(__dirname, '..', 'data', 'clientes.json')
    const clientesData = JSON.parse(fs.readFileSync(caminhoClientes, 'utf8'))
    
    let sucessos = 0
    
    for (const cliente of clientesData) {
      const resultado = await fazerRequisicao('/clientes', 'POST', cliente)
      
      if (resultado.ok) {
        sucessos++
        console.log(`   ✅ ${cliente.nome} (${cliente.role})`)
      } else {
        console.log(`   ❌ ${cliente.nome}: ${resultado.error}`)
      }
    }
    
    console.log(`✅ ${sucessos}/${clientesData.length} clientes inseridos`)
    return sucessos
  } catch (error) {
    console.error('❌ Erro ao popular clientes:', error.message)
    throw error
  }
}

// Função para popular reservas via API
async function popularReservasViaAPI() {
  try {
    console.log('📅 Populando reservas via API...')
    
    // Ler dados das reservas
    const caminhoReservas = path.join(__dirname, '..', 'data', 'reservas.json')
    const reservasData = JSON.parse(fs.readFileSync(caminhoReservas, 'utf8'))
    
    let sucessos = 0
    
    for (const reserva of reservasData) {
      const resultado = await fazerRequisicao('/reservas', 'POST', reserva)
      
      if (resultado.ok) {
        sucessos++
        console.log(`   ✅ ${reserva.id} - ${reserva.cliente_id}`)
      } else {
        console.log(`   ❌ ${reserva.id}: ${resultado.error}`)
      }
    }
    
    console.log(`✅ ${sucessos}/${reservasData.length} reservas inseridas`)
    return sucessos
  } catch (error) {
    console.error('❌ Erro ao popular reservas:', error.message)
    throw error
  }
}

// Função para verificar se o servidor está rodando
async function verificarServidor() {
  try {
    console.log('🔗 Verificando se o servidor está rodando...')
    
    const resultado = await fazerRequisicao('/quadras')
    
    if (resultado.ok) {
      console.log('✅ Servidor está rodando')
      return true
    } else {
      throw new Error('Servidor não está respondendo')
    }
  } catch (error) {
    console.error('❌ Servidor não está rodando:', error.message)
    console.log('')
    console.log('🚀 Para iniciar o servidor, execute:')
    console.log('   npm run dev')
    console.log('')
    return false
  }
}

// Função para gerar relatório final
async function gerarRelatorio(estatisticas) {
  try {
    console.log('\n📊 GERANDO RELATÓRIO FINAL...')
    
    // Buscar dados atualizados
    const [quadrasRes, clientesRes, reservasRes] = await Promise.all([
      fazerRequisicao('/quadras'),
      fazerRequisicao('/clientes'),
      fazerRequisicao('/reservas')
    ])
    
    const quadras = quadrasRes.ok ? quadrasRes.data : []
    const clientes = clientesRes.ok ? clientesRes.data : []
    const reservas = reservasRes.ok ? reservasRes.data : []
    
    // Calcular estatísticas
    const totalReservas = reservas.length
    const reservasConfirmadas = reservas.filter(r => r.status === 'confirmada').length
    const receitaTotal = reservas.filter(r => r.status === 'confirmada').reduce((total, r) => total + (r.valor_total || 0), 0)
    const clientesAtivos = clientes.filter(c => c.ativo).length
    const quadrasAtivas = quadras.filter(q => q.ativa).length
    
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
        }
      },
      resumo: {
        data_populacao: new Date().toISOString(),
        total_registros: quadras.length + clientes.length + reservas.length,
        receita_mensal_estimada: receitaTotal * 30, // Estimativa mensal
        populacao_via_api: true
      }
    }
    
    // Salvar relatório
    const caminhoRelatorio = path.join(__dirname, '..', 'data', 'relatorio-api.json')
    fs.writeFileSync(caminhoRelatorio, JSON.stringify(relatorio, null, 2))
    
    console.log('✅ Relatório salvo em: /data/relatorio-api.json')
    
    return relatorio
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error.message)
    return null
  }
}

// Função principal
async function popularViaAPI() {
  try {
    console.log('🚀 Iniciando população via APIs...\n')
    
    // Verificar se o servidor está rodando
    const servidorAtivo = await verificarServidor()
    if (!servidorAtivo) {
      return
    }
    
    console.log('')
    
    // Popular todas as tabelas
    const estatisticas = {}
    
    estatisticas.quadras = await popularQuadrasViaAPI()
    estatisticas.clientes = await popularClientesViaAPI()
    estatisticas.reservas = await popularReservasViaAPI()
    
    // Gerar relatório final
    const relatorio = await gerarRelatorio(estatisticas)
    
    // Resumo final
    console.log('\n🎉 POPULAÇÃO VIA API CONCLUÍDA!')
    console.log('================================')
    console.log('')
    console.log('📊 RESUMO:')
    console.log(`   🏟️  Quadras: ${estatisticas.quadras}`)
    console.log(`   👥 Clientes: ${estatisticas.clientes}`)
    console.log(`   📅 Reservas: ${estatisticas.reservas}`)
    console.log('')
    
    if (relatorio) {
      console.log('💰 RECEITA TOTAL: R$', relatorio.estatisticas.reservas.receita_total.toLocaleString('pt-BR'))
      console.log('📈 RECEITA MENSAL ESTIMADA: R$', relatorio.resumo.receita_mensal_estimada.toLocaleString('pt-BR'))
      console.log('')
    }
    
    console.log('🔗 DADOS DISPONÍVEIS:')
    console.log('   ✅ Quadras ativas e configuradas')
    console.log('   ✅ Clientes e usuários cadastrados')
    console.log('   ✅ Reservas para os próximos 30 dias')
    console.log('')
    console.log('👤 USUÁRIOS DE TESTE:')
    console.log('   Admin: admin@arenacoligados.com.br')
    console.log('   Professor: rafael.professor@arenacoligados.com.br')
    console.log('   Cliente: joao.silva@email.com')
    console.log('')
    console.log('✅ AGORA VOCÊ PODE USAR A PLATAFORMA!')
    console.log('   Acesse: http://localhost:3000/dashboard')
    console.log('   Os dados estão disponíveis no Supabase')
    
  } catch (error) {
    console.error('❌ Erro ao popular via API:', error.message)
    console.log('')
    console.log('🔧 POSSÍVEIS SOLUÇÕES:')
    console.log('1. Certifique-se de que o servidor está rodando (npm run dev)')
    console.log('2. Verifique se as APIs estão funcionando')
    console.log('3. Execute: node scripts/create-mock-data.js primeiro')
    console.log('4. Verifique se o Supabase está configurado corretamente')
  }
}

// Executar
popularViaAPI()



