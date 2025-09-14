// test-sheets.js - Script de teste para Google Sheets
const { testConnection, readSheet } = require('./lib/google-sheets.ts');

async function testGoogleSheets() {
  console.log('🧪 Testando conexão com Google Sheets...');
  
  try {
    // Teste 1: Conectividade
    console.log('\n1. Testando conectividade...');
    const connectionTest = await testConnection();
    
    if (connectionTest.success) {
      console.log('✅ Conexão bem-sucedida!');
      console.log('📊 Título da planilha:', connectionTest.title);
      console.log('📋 Abas disponíveis:', connectionTest.sheets.map(s => s.title));
    } else {
      console.log('❌ Falha na conexão:', connectionTest.message);
      return;
    }

    // Teste 2: Leitura de dados
    console.log('\n2. Testando leitura de dados...');
    
    const sheets = ['Reservas', 'Clientes', 'Quadras', 'Professores', 'Usuarios'];
    
    for (const sheet of sheets) {
      try {
        console.log(`\n📖 Lendo aba: ${sheet}`);
        const data = await readSheet(`${sheet}!A:Z`);
        console.log(`✅ ${sheet}: ${data.length} linhas encontradas`);
        
        if (data.length > 0) {
          console.log(`   Headers: ${data[0].join(' | ')}`);
        }
      } catch (error) {
        console.log(`❌ ${sheet}: Erro - ${error.message}`);
      }
    }

    console.log('\n🎉 Teste concluído!');
    
  } catch (error) {
    console.error('💥 Erro durante o teste:', error);
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testGoogleSheets();
}

module.exports = { testGoogleSheets };