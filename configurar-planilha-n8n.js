// configurar-planilha-n8n.js
// Script para configurar a planilha do N8N com as abas necessárias

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

async function verificarPlanilha() {
  console.log('🔍 VERIFICANDO PLANILHA DO N8N\n');
  console.log('=' .repeat(50));
  
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
    
    // Verificar abas necessárias
    const abasNecessarias = ['leads', 'clientes', 'reservas', 'professores', 'quadras', 'avaliacoes'];
    const abasFaltando = abasNecessarias.filter(aba => !abasExistentes.includes(aba));
    
    if (abasFaltando.length === 0) {
      console.log('\n✅ Todas as abas necessárias estão presentes!');
    } else {
      console.log(`\n⚠️  Abas faltando: ${abasFaltando.join(', ')}`);
      console.log('\n💡 AÇÕES NECESSÁRIAS:');
      console.log('1. Compartilhe a planilha com: arenasheets@credencial-n8n-471801.iam.gserviceaccount.com');
      console.log('2. Dê permissão de "Editor"');
      console.log('3. Execute: node criar-abas-n8n.js para criar as abas faltando');
    }
    
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

verificarPlanilha().catch(console.error);
