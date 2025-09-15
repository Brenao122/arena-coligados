// test-simple.js
// Script simples para testar as APIs

const http = require('http');

function testAPI(path, callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        callback(null, { status: res.statusCode, data: jsonData });
      } catch (error) {
        callback(null, { status: res.statusCode, data: data });
      }
    });
  });

  req.on('error', (error) => {
    callback(error, null);
  });

  req.end();
}

console.log('🧪 Testando APIs do sistema híbrido...\n');

// Teste 1: Verificar se o servidor está rodando
testAPI('/api/test/populate', (error, result) => {
  if (error) {
    console.log('❌ Servidor não está rodando ou não respondeu');
    console.log('   Erro:', error.message);
    return;
  }

  console.log('✅ Servidor está rodando!');
  console.log('   Status:', result.status);
  console.log('   Dados atuais:', result.data.data);
  console.log('');

  // Teste 2: Popular dados de teste
  console.log('🚀 Populando dados de teste...');
  
  const postOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/test/populate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const postReq = http.request(postOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ Dados populados com sucesso!');
        console.log('   Resultado:', jsonData.data);
        console.log('');

        // Teste 3: Verificar APIs híbridas
        console.log('🔍 Testando APIs híbridas...');
        
        testAPI('/api/hybrid/clientes', (error, result) => {
          if (error) {
            console.log('❌ Erro ao testar clientes:', error.message);
            return;
          }
          console.log('✅ Clientes:', result.data.count, 'itens (fonte:', result.data.source + ')');
        });

        testAPI('/api/hybrid/quadras', (error, result) => {
          if (error) {
            console.log('❌ Erro ao testar quadras:', error.message);
            return;
          }
          console.log('✅ Quadras:', result.data.count, 'itens (fonte:', result.data.source + ')');
        });

        testAPI('/api/hybrid/reservas', (error, result) => {
          if (error) {
            console.log('❌ Erro ao testar reservas:', error.message);
            return;
          }
          console.log('✅ Reservas:', result.data.count, 'itens (fonte:', result.data.source + ')');
        });

        testAPI('/api/hybrid/dashboard', (error, result) => {
          if (error) {
            console.log('❌ Erro ao testar dashboard:', error.message);
            return;
          }
          console.log('✅ Dashboard: OK (fonte:', result.data.source + ')');
          console.log('');
          console.log('🎉 Todos os testes concluídos com sucesso!');
          console.log('');
          console.log('🌐 Acesse:');
          console.log('   - Dashboard: http://localhost:3000/dashboard/dashboard-admin');
          console.log('   - Página de Teste: http://localhost:3000/test');
          console.log('   - Clientes: http://localhost:3000/dashboard/clientes');
          console.log('   - Quadras: http://localhost:3000/dashboard/quadras');
          console.log('   - Reservas: http://localhost:3000/dashboard/reservas');
        });

      } catch (error) {
        console.log('❌ Erro ao processar resposta:', error.message);
      }
    });
  });

  postReq.on('error', (error) => {
    console.log('❌ Erro ao popular dados:', error.message);
  });

  postReq.end();
});
