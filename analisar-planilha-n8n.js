// analisar-planilha-n8n.js
// Script para analisar a estrutura da planilha do N8N e adaptar a plataforma

const { google } = require('googleapis');
const fs = require('fs');

// Carregar variáveis do .env.local
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
  } catch (error) {
    console.log('⚠️  Arquivo .env.local não encontrado');
  }
}

loadEnv();

// Configuração do Google Sheets
function getAuth() {
  const email = process.env.GOOGLE_SERVICE_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  
  if (!email || !key) {
    throw new Error('❌ GOOGLE_SERVICE_EMAIL ou GOOGLE_PRIVATE_KEY não encontrados');
  }
  
  return new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

function getSpreadsheetId() {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) {
    throw new Error('❌ GOOGLE_SHEETS_SPREADSHEET_ID não encontrado');
  }
  return id;
}

async function analisarPlanilhaN8N() {
  console.log('🔍 ANALISANDO ESTRUTURA DA PLANILHA N8N\n');
  console.log('=' .repeat(60));
  
  try {
    const sheets = getSheets();
    const spreadsheetId = getSpreadsheetId();
    
    console.log(`📊 Planilha: ${spreadsheetId}`);
    console.log(`🔗 URL: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
    
    // Verificar se consegue acessar a planilha
    const { data } = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    console.log(`✅ Planilha acessível: "${data.properties.title}"`);
    
    // Listar abas existentes
    const abasExistentes = data.sheets?.map(sheet => sheet.properties.title) || [];
    console.log(`\n📋 Abas existentes: ${abasExistentes.join(', ')}`);
    
    // Analisar cada aba
    console.log('\n🔍 ANÁLISE DETALHADA DAS ABAS:');
    console.log('-'.repeat(60));
    
    for (const aba of abasExistentes) {
      try {
        console.log(`\n📊 Aba: "${aba}"`);
        
        // Ler primeiras linhas para ver estrutura
        const { data: abaData } = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${aba}!A1:Z10`,
        });
        
        const rows = abaData.values || [];
        
        if (rows.length === 0) {
          console.log(`   ⚠️  Aba vazia`);
        } else {
          // Mostrar cabeçalhos
          const headers = rows[0] || [];
          console.log(`   📋 Cabeçalhos: ${headers.join(' | ')}`);
          
          // Mostrar algumas linhas de dados
          if (rows.length > 1) {
            console.log(`   📊 Dados (${rows.length - 1} linhas):`);
            rows.slice(1, 4).forEach((row, index) => {
              const rowData = row.map(cell => cell || '').join(' | ');
              console.log(`      ${index + 1}: ${rowData}`);
            });
            if (rows.length > 4) {
              console.log(`      ... e mais ${rows.length - 4} linhas`);
            }
          }
        }
        
      } catch (error) {
        console.log(`   ❌ Erro ao ler aba "${aba}": ${error.message}`);
      }
    }
    
    // Sugestões de mapeamento
    console.log('\n💡 SUGESTÕES DE MAPEAMENTO:');
    console.log('-'.repeat(60));
    
    const mapeamento = {
      'leads': ['leads', 'lead', 'prospects', 'interessados'],
      'clientes': ['clientes', 'cliente', 'customers', 'usuarios'],
      'reservas': ['reservas', 'reserva', 'bookings', 'agendamentos'],
      'professores': ['professores', 'professor', 'instrutores', 'teachers'],
      'quadras': ['quadras', 'quadra', 'courts', 'arenas'],
      'avaliacoes': ['avaliacoes', 'avaliacao', 'reviews', 'ratings']
    };
    
    for (const [tipo, possibilidades] of Object.entries(mapeamento)) {
      const abaEncontrada = abasExistentes.find(aba => 
        possibilidades.some(possibilidade => 
          aba.toLowerCase().includes(possibilidade.toLowerCase())
        )
      );
      
      if (abaEncontrada) {
        console.log(`✅ ${tipo.toUpperCase()} → "${abaEncontrada}"`);
      } else {
        console.log(`❌ ${tipo.toUpperCase()} → Nenhuma aba encontrada`);
        console.log(`   💡 Procure por: ${possibilidades.join(', ')}`);
      }
    }
    
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('1. Verifique se o mapeamento está correto');
    console.log('2. Se necessário, ajuste os nomes das abas na plataforma');
    console.log('3. Execute: npm run dev para testar');
    
  } catch (error) {
    console.log(`\n❌ Erro ao acessar planilha: ${error.message}`);
    
    if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n🔐 PROBLEMA DE PERMISSÃO:');
      console.log('1. A planilha não está compartilhada com o service account');
      console.log('2. Compartilhe com: arenasheets@credencial-n8n-471801.iam.gserviceaccount.com');
      console.log('3. Dê permissão de "Editor"');
    } else if (error.message.includes('DECODER')) {
      console.log('\n🔑 PROBLEMA DE AUTENTICAÇÃO:');
      console.log('1. Verifique se as credenciais estão corretas');
      console.log('2. Verifique se o service account tem as permissões necessárias');
    }
  }
}

analisarPlanilhaN8N().catch(console.error);
