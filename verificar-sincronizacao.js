// verificar-sincronizacao.js
// Script para verificar se os dados da plataforma estão sincronizados com as planilhas

const { google } = require('googleapis');
const fs = require('fs');

// Carregar variáveis do .env.local manualmente
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
    console.log('⚠️  Arquivo .env.local não encontrado, usando variáveis do sistema');
  }
}

loadEnv();

// Configuração do Google Sheets
function getAuth() {
  const email = process.env.GOOGLE_SERVICE_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  
  if (!email || !key) {
    throw new Error('❌ GOOGLE_SERVICE_EMAIL ou GOOGLE_PRIVATE_KEY não encontrados no .env.local');
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
    throw new Error('❌ GOOGLE_SHEETS_SPREADSHEET_ID não encontrado no .env.local');
  }
  return id;
}

async function readSheetData(sheetName) {
  try {
    const sheets = getSheets();
    const spreadsheetId = getSpreadsheetId();
    
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:ZZ`,
    });
    
    const rows = data.values || [];
    if (rows.length === 0) return [];
    
    const header = rows[0];
    return rows.slice(1).map(row => {
      const obj = {};
      header.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });
  } catch (error) {
    console.log(`⚠️  Erro ao ler ${sheetName}:`, error.message);
    return [];
  }
}

async function verificarPlanilhas() {
  console.log('🔍 VERIFICANDO SINCRONIZAÇÃO DA PLATAFORMA COM GOOGLE SHEETS\n');
  console.log('=' .repeat(60));
  
  const planilhas = [
    'leads',
    'clientes', 
    'reservas',
    'professores',
    'quadras',
    'avaliacoes',
    'logs'
  ];
  
  let totalRegistros = 0;
  
  for (const planilha of planilhas) {
    console.log(`\n📊 ${planilha.toUpperCase()}:`);
    console.log('-'.repeat(40));
    
    const dados = await readSheetData(planilha);
    const quantidade = dados.length;
    totalRegistros += quantidade;
    
    if (quantidade === 0) {
      console.log(`   ⚠️  Planilha vazia - ${quantidade} registros`);
    } else {
      console.log(`   ✅ ${quantidade} registros encontrados`);
      
      // Mostrar alguns exemplos dos dados
      if (quantidade > 0) {
        console.log(`   📋 Exemplo de dados:`);
        const exemplo = dados[0];
        Object.keys(exemplo).slice(0, 3).forEach(key => {
          console.log(`      ${key}: ${exemplo[key] || '(vazio)'}`);
        });
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📈 RESUMO TOTAL: ${totalRegistros} registros em todas as planilhas`);
  
  if (totalRegistros === 0) {
    console.log('\n⚠️  ATENÇÃO: Todas as planilhas estão vazias!');
    console.log('   Isso significa que sua plataforma ainda não está');
    console.log('   sincronizada com o Google Sheets.');
    console.log('\n💡 PRÓXIMOS PASSOS:');
    console.log('   1. Verificar se os dados estão sendo salvos no Supabase');
    console.log('   2. Migrar dados existentes para as planilhas');
    console.log('   3. Atualizar componentes para usar Google Sheets');
  } else {
    console.log('\n✅ ÓTIMO! Você já tem dados nas planilhas.');
    console.log('   Agora precisamos verificar se os componentes');
    console.log('   da plataforma estão lendo dessas planilhas.');
  }
}

// Executar verificação
verificarPlanilhas().catch(console.error);
