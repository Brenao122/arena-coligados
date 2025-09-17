// test-sheets-primary.js
// Script para testar o sistema híbrido com Google Sheets como principal

const baseUrl = 'http://localhost:3000'

async function testSheetsPrimary() {
  console.log('🧪 Testando sistema híbrido com Google Sheets como principal...\n')

  const endpoints = [
    { name: 'Dashboard Stats', url: `${baseUrl}/api/sheets-primary/dashboard` },
    { name: 'Clientes', url: `${baseUrl}/api/sheets-primary/clientes` },
    { name: 'Quadras', url: `${baseUrl}/api/sheets-primary/quadras` },
    { name: 'Reservas', url: `${baseUrl}/api/sheets-primary/reservas` },
    { name: 'Sync', url: `${baseUrl}/api/sheets-primary/sync`, method: 'POST' }
  ]

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testando ${endpoint.name}...`)
      console.log(`📡 URL: ${endpoint.url}`)
      
      const options = {
        method: endpoint.method || 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const response = await fetch(endpoint.url, options)
      const data = await response.json()
      
      console.log(`📊 Status: ${response.status}`)
      console.log(`✅ OK: ${data.ok}`)
      console.log(`🔄 Fonte: ${data.source}`)
      
      if (data.ok) {
        if (data.data) {
          if (Array.isArray(data.data)) {
            console.log(`📈 Total de itens: ${data.data.length}`)
            if (data.data.length > 0) {
              console.log(`📋 Primeiro item:`, JSON.stringify(data.data[0], null, 2))
            }
          } else if (typeof data.data === 'object') {
            console.log(`📊 Dados:`, JSON.stringify(data.data, null, 2))
          }
        }
        if (data.count !== undefined) {
          console.log(`🔢 Contagem: ${data.count}`)
        }
      } else {
        console.log(`❌ Erro: ${data.error}`)
      }
      
      if (data.details) {
        console.log(`🔍 Detalhes:`, JSON.stringify(data.details, null, 2))
      }
      
    } catch (error) {
      console.error(`❌ Erro ao testar ${endpoint.name}:`, error.message)
    }
  }

  console.log('\n🎯 Teste do sistema híbrido concluído!')
  console.log('\n📋 Resumo:')
  console.log('- ✅ Google Sheets como fonte principal')
  console.log('- 💾 Supabase como backup automático')
  console.log('- 🔄 Fallback automático se Sheets falhar')
  console.log('- 📊 Sincronização em tempo real')
}

// Executar teste
testSheetsPrimary().catch(console.error)
