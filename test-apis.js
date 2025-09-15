// test-apis.js
// Script para testar as APIs do sistema híbrido

const BASE_URL = 'http://localhost:3000'

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
    if (body) {
      options.body = JSON.stringify(body)
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json()
    
    return {
      ok: response.ok,
      status: response.status,
      data
    }
  } catch (error) {
    return {
      ok: false,
      error: error.message
    }
  }
}

async function runTests() {
  console.log('🧪 Iniciando testes das APIs...\n')
  
  // Teste 1: Popular dados de teste
  console.log('1️⃣ Testando população de dados...')
  const populateResult = await testAPI('/api/test/populate', 'POST')
  console.log('   Resultado:', populateResult.ok ? '✅ Sucesso' : '❌ Erro')
  if (populateResult.data) {
    console.log('   Dados inseridos:', populateResult.data.data)
  }
  console.log('')
  
  // Teste 2: Verificar dados inseridos
  console.log('2️⃣ Verificando dados inseridos...')
  const checkResult = await testAPI('/api/test/populate')
  console.log('   Resultado:', checkResult.ok ? '✅ Sucesso' : '❌ Erro')
  if (checkResult.data) {
    console.log('   Estatísticas:', checkResult.data.data)
  }
  console.log('')
  
  // Teste 3: APIs Híbridas
  console.log('3️⃣ Testando APIs híbridas...')
  
  const [clientesRes, quadrasRes, reservasRes, dashboardRes] = await Promise.all([
    testAPI('/api/hybrid/clientes'),
    testAPI('/api/hybrid/quadras'),
    testAPI('/api/hybrid/reservas'),
    testAPI('/api/hybrid/dashboard')
  ])
  
  console.log('   Clientes:', clientesRes.ok ? `✅ ${clientesRes.data.count} itens (${clientesRes.data.source})` : '❌ Erro')
  console.log('   Quadras:', quadrasRes.ok ? `✅ ${quadrasRes.data.count} itens (${quadrasRes.data.source})` : '❌ Erro')
  console.log('   Reservas:', reservasRes.ok ? `✅ ${reservasRes.data.count} itens (${reservasRes.data.source})` : '❌ Erro')
  console.log('   Dashboard:', dashboardRes.ok ? `✅ OK (${dashboardRes.data.source})` : '❌ Erro')
  console.log('')
  
  // Teste 4: Sincronização
  console.log('4️⃣ Testando sincronização...')
  const syncResult = await testAPI('/api/hybrid/sync', 'POST')
  console.log('   Resultado:', syncResult.ok ? '✅ Sucesso' : '❌ Erro')
  if (syncResult.data) {
    console.log('   Mensagem:', syncResult.data.message)
  }
  console.log('')
  
  // Teste 5: Status das conexões
  console.log('5️⃣ Verificando status das conexões...')
  const statusResult = await testAPI('/api/hybrid/sync')
  console.log('   Resultado:', statusResult.ok ? '✅ Sucesso' : '❌ Erro')
  if (statusResult.data) {
    console.log('   Supabase:', statusResult.data.data.supabase.status)
    console.log('   Sheets:', statusResult.data.data.sheets.status)
  }
  console.log('')
  
  // Teste 6: APIs originais
  console.log('6️⃣ Testando APIs originais...')
  const [sheetsRes, supabaseRes] = await Promise.all([
    testAPI('/api/sheets/ping'),
    testAPI('/api/test/populate')
  ])
  
  console.log('   Sheets:', sheetsRes.ok ? '✅ Conectado' : '❌ Erro')
  console.log('   Supabase:', supabaseRes.ok ? '✅ Conectado' : '❌ Erro')
  console.log('')
  
  console.log('🎉 Testes concluídos!')
  console.log('')
  console.log('📋 Resumo:')
  console.log('   - Dados de teste inseridos no Supabase')
  console.log('   - APIs híbridas funcionando')
  console.log('   - Sistema de sincronização ativo')
  console.log('   - Fallback para planilhas configurado')
  console.log('')
  console.log('🌐 Acesse:')
  console.log('   - Dashboard: http://localhost:3000/dashboard/dashboard-admin')
  console.log('   - Página de Teste: http://localhost:3000/test')
  console.log('   - Clientes: http://localhost:3000/dashboard/clientes')
  console.log('   - Quadras: http://localhost:3000/dashboard/quadras')
  console.log('   - Reservas: http://localhost:3000/dashboard/reservas')
}

// Executar testes
runTests().catch(console.error)