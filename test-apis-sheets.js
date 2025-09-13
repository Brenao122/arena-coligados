// Script para testar as APIs das planilhas
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAPI(endpoint, description) {
  try {
    console.log(`\n🔍 Testando: ${description}`);
    console.log(`   URL: ${BASE_URL}${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`   ✅ Sucesso! ${data.rows?.length || 0} registros encontrados`);
      if (data.rows && data.rows.length > 0) {
        console.log(`   📋 Primeiro registro:`, Object.keys(data.rows[0]).slice(0, 5).join(', '));
      }
    } else {
      console.log(`   ❌ Erro: ${data.error || 'Erro desconhecido'}`);
    }
  } catch (error) {
    console.log(`   ❌ Erro de conexão: ${error.message}`);
  }
}

async function testAllAPIs() {
  console.log('🚀 Testando todas as APIs das planilhas...');
  
  const tests = [
    { endpoint: '/api/sheets/read?sheet=leads', description: 'API de Leads' },
    { endpoint: '/api/sheets/read?sheet=clientes', description: 'API de Clientes' },
    { endpoint: '/api/sheets/read?sheet=quadras', description: 'API de Quadras' },
    { endpoint: '/api/sheets/read?sheet=professores', description: 'API de Professores' },
    { endpoint: '/api/sheets/read?sheet=Página1', description: 'API de Reservas (Página1)' },
    { endpoint: '/api/sheets/read?sheet=pagamentos', description: 'API de Pagamentos' },
    { endpoint: '/api/sheets/read?sheet=avaliacoes', description: 'API de Avaliações' },
    { endpoint: '/api/sheets/read?sheet=usuarios', description: 'API de Usuários' }
  ];
  
  for (const test of tests) {
    await testAPI(test.endpoint, test.description);
  }
  
  console.log('\n✅ Teste de APIs concluído!');
  console.log('\n📝 Próximos passos:');
  console.log('1. Iniciar o servidor Next.js: npm run dev');
  console.log('2. Testar as APIs no navegador');
  console.log('3. Verificar se os componentes estão funcionando');
}

// Executar se chamado diretamente
if (require.main === module) {
  testAllAPIs();
}

module.exports = { testAllAPIs };
