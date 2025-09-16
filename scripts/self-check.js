// scripts/self-check.js (server-only)
const http = require('http')

const BASE_URL = 'http://localhost:3000'

async function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve({ status: res.statusCode, data: json })
        } catch (e) {
          resolve({ status: res.statusCode, data: data })
        }
      })
    })
    req.on('error', reject)
    req.setTimeout(5000, () => reject(new Error('Timeout')))
  })
}

async function selfCheck() {
  console.log('🔍 Iniciando self-check...')
  
  try {
    // Teste 1: /api/test
    console.log('📡 Testando /api/test...')
    const test1 = await makeRequest('/api/test')
    console.log(`✅ /api/test: ${test1.status} - ${JSON.stringify(test1.data)}`)
    
    // Teste 2: /api/diag
    console.log('📡 Testando /api/diag...')
    const test2 = await makeRequest('/api/diag')
    console.log(`✅ /api/diag: ${test2.status} - ${JSON.stringify(test2.data)}`)
    
    // Teste 3: /api/hybrid/dashboard
    console.log('📡 Testando /api/hybrid/dashboard...')
    const test3 = await makeRequest('/api/hybrid/dashboard')
    console.log(`✅ /api/hybrid/dashboard: ${test3.status} - ${JSON.stringify(test3.data)}`)
    
    console.log('🎉 Self-check concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro no self-check:', error.message)
    process.exit(1)
  }
}

selfCheck()
