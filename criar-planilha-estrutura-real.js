// Script para criar/atualizar a estrutura da planilha real
// Baseado na planilha existente: 174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew

const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

// Configuração de autenticação
function getAuth() {
  const email = process.env.GOOGLE_SERVICE_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  
  if (!email || !key) {
    throw new Error('GOOGLE_SERVICE_EMAIL / GOOGLE_PRIVATE_KEY ausentes no .env.local');
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
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID ausente no .env.local');
  }
  return id;
}

// Estrutura das abas baseada na realidade atual
const ESTRUTURA_ABAS = {
  // Aba principal (já existe) - expandir com campos adicionais
  'Página1': {
    nome: 'Reservas',
    headers: [
      'id', 'nome', 'telefone', 'email', 'data', 'hora', 'servico', 
      'status', 'quadra_id', 'professor_id', 'valor', 'observacoes', 
      'created_at', 'updated_at'
    ]
  },
  
  // Aba de usuários (já existe) - expandir
  'usuarios': {
    nome: 'Usuários',
    headers: [
      'id', 'nome', 'email', 'telefone', 'role', 'status', 
      'created_at', 'updated_at'
    ]
  },
  
  // Novas abas necessárias
  'quadras': {
    nome: 'Quadras',
    headers: [
      'id', 'nome', 'tipo', 'preco_hora', 'capacidade', 'ativa', 
      'descricao', 'imagem_url', 'equipamentos', 'created_at', 'updated_at'
    ]
  },
  
  'professores': {
    nome: 'Professores',
    headers: [
      'id', 'nome', 'telefone', 'email', 'especialidades', 'preco_aula', 
      'disponibilidade', 'ativo', 'created_at', 'updated_at'
    ]
  },
  
  'clientes': {
    nome: 'Clientes',
    headers: [
      'id', 'nome', 'telefone', 'email', 'endereco', 'data_nascimento', 
      'status', 'created_at', 'updated_at'
    ]
  },
  
  'leads': {
    nome: 'Leads',
    headers: [
      'id', 'nome', 'telefone', 'email', 'origem', 'interesse', 
      'status', 'observacoes', 'created_at', 'updated_at'
    ]
  },
  
  'pagamentos': {
    nome: 'Pagamentos',
    headers: [
      'id', 'reserva_id', 'valor', 'metodo', 'status', 'data_pagamento', 
      'created_at', 'updated_at'
    ]
  },
  
  'avaliacoes': {
    nome: 'Avaliações',
    headers: [
      'id', 'cliente_id', 'professor_id', 'reserva_id', 'nota', 
      'comentario', 'created_at', 'updated_at'
    ]
  }
};

async function criarOuAtualizarAba(sheetName, config) {
  const sheets = getSheets();
  const spreadsheetId = getSpreadsheetId();
  
  try {
    console.log(`📋 Processando aba: ${sheetName} (${config.nome})`);
    
    // Verificar se a aba existe
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    const existingSheets = spreadsheet.data.sheets || [];
    const sheetExists = existingSheets.some(sheet => sheet.properties.title === sheetName);
    
    if (!sheetExists) {
      console.log(`  ➕ Criando nova aba: ${sheetName}`);
      
      // Criar nova aba
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName,
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 20
                }
              }
            }
          }]
        }
      });
    } else {
      console.log(`  ✅ Aba já existe: ${sheetName}`);
    }
    
    // Verificar se o cabeçalho existe
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:ZZ1`,
    });
    
    const hasHeader = (data.values?.[0]?.length ?? 0) > 0;
    
    if (!hasHeader) {
      console.log(`  📝 Adicionando cabeçalho para ${sheetName}`);
      
      // Adicionar cabeçalho
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [config.headers]
        }
      });
    } else {
      console.log(`  ✅ Cabeçalho já existe em ${sheetName}`);
    }
    
    // Adicionar dados de exemplo se a aba estiver vazia (exceto cabeçalho)
    const { data: allData } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:ZZ`,
    });
    
    const hasData = (allData.values?.length ?? 0) > 1;
    
    if (!hasData && sheetName !== 'Página1' && sheetName !== 'usuarios') {
      console.log(`  📊 Adicionando dados de exemplo para ${sheetName}`);
      await adicionarDadosExemplo(sheetName, config);
    }
    
  } catch (error) {
    console.error(`❌ Erro ao processar aba ${sheetName}:`, error.message);
  }
}

async function adicionarDadosExemplo(sheetName, config) {
  const sheets = getSheets();
  const spreadsheetId = getSpreadsheetId();
  
  const dadosExemplo = {
    'quadras': [
      {
        id: 'quadra-1',
        nome: 'Quadra de Tênis 1',
        tipo: 'Tênis',
        preco_hora: 50,
        capacidade: 4,
        ativa: true,
        descricao: 'Quadra de tênis profissional com piso sintético',
        imagem_url: '/tennis-court-professional.png',
        equipamentos: 'Raquetes, Bolas',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'quadra-2',
        nome: 'Quadra de Beach Tennis',
        tipo: 'Beach Tennis',
        preco_hora: 60,
        capacidade: 4,
        ativa: true,
        descricao: 'Quadra de beach tennis com areia',
        imagem_url: '/beach-tennis-court-sand.png',
        equipamentos: 'Raquetes, Bolas',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    'professores': [
      {
        id: 'prof-1',
        nome: 'João Silva',
        telefone: '5562999999999',
        email: 'joao@arena.com',
        especialidades: 'Tênis, Beach Tennis',
        preco_aula: 80,
        disponibilidade: 'Seg-Sex 8h-18h',
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    'clientes': [
      {
        id: 'cliente-1',
        nome: 'Maria Santos',
        telefone: '5562888888888',
        email: 'maria@email.com',
        endereco: 'Rua das Flores, 123',
        data_nascimento: '1990-01-15',
        status: 'ativo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    'leads': [
      {
        id: 'lead-1',
        nome: 'Pedro Costa',
        telefone: '5562777777777',
        email: 'pedro@email.com',
        origem: 'whatsapp',
        interesse: 'Aulas de tênis',
        status: 'novo',
        observacoes: 'Interessado em aulas particulares',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  };
  
  const dados = dadosExemplo[sheetName] || [];
  
  if (dados.length > 0) {
    const values = dados.map(item => 
      config.headers.map(header => item[header] || '')
    );
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando criação/atualização da estrutura da planilha...');
    console.log(`📊 Planilha ID: ${getSpreadsheetId()}`);
    
    // Processar cada aba
    for (const [sheetName, config] of Object.entries(ESTRUTURA_ABAS)) {
      await criarOuAtualizarAba(sheetName, config);
    }
    
    console.log('\n✅ Estrutura da planilha criada/atualizada com sucesso!');
    console.log('\n📋 Abas disponíveis:');
    for (const [sheetName, config] of Object.entries(ESTRUTURA_ABAS)) {
      console.log(`  - ${sheetName}: ${config.nome}`);
    }
    
    console.log('\n🔧 Próximos passos:');
    console.log('1. Atualizar tipos TypeScript em lib/repo.ts');
    console.log('2. Corrigir componentes para usar dados reais');
    console.log('3. Testar integração com APIs');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { ESTRUTURA_ABAS, criarOuAtualizarAba };
