// migrar-dados-supabase.js
// Script para migrar dados do Supabase para Google Sheets

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
    console.log('⚠️  Arquivo .env.local não encontrado, usando variáveis do sistema');
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

async function appendRows(sheetName, rows) {
  if (!rows.length) return;
  
  const sheets = getSheets();
  const spreadsheetId = getSpreadsheetId();
  
  // Monta cabeçalho automaticamente
  const header = Object.keys(rows[0]);
  const values = rows.map(r => header.map(h => r[h] ?? ''));
  
  // Garante cabeçalho na primeira linha
  await ensureHeader(sheetName, header);
  
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

async function ensureHeader(sheetName, header) {
  const sheets = getSheets();
  const spreadsheetId = getSpreadsheetId();
  
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:ZZ1`,
  });
  
  const hasHeader = (data.values?.[0]?.length ?? 0) > 0;
  
  if (!hasHeader) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [header] },
    });
  }
}

// Dados de exemplo para popular as planilhas
const dadosExemplo = {
  leads: [
    {
      id: 'lead_001',
      nome: 'João Silva',
      telefone: '11999999999',
      email: 'joao@email.com',
      origem: 'Facebook',
      status: 'novo',
      created_at: new Date().toISOString(),
      observacoes: 'Interessado em aulas de tênis'
    },
    {
      id: 'lead_002',
      nome: 'Maria Santos',
      telefone: '11888888888',
      email: 'maria@email.com',
      origem: 'Instagram',
      status: 'contatado',
      created_at: new Date().toISOString(),
      observacoes: 'Quer saber sobre preços'
    }
  ],
  
  clientes: [
    {
      id: 'cliente_001',
      nome: 'Carlos Oliveira',
      telefone: '11777777777',
      email: 'carlos@email.com',
      cpf: '123.456.789-00',
      endereco: 'Rua das Flores, 123',
      created_at: new Date().toISOString(),
      status: 'ativo'
    },
    {
      id: 'cliente_002',
      nome: 'Ana Costa',
      telefone: '11666666666',
      email: 'ana@email.com',
      cpf: '987.654.321-00',
      endereco: 'Av. Principal, 456',
      created_at: new Date().toISOString(),
      status: 'ativo'
    }
  ],
  
  quadras: [
    {
      id: 'quadra_001',
      nome: 'Quadra 1 - Tênis',
      tipo: 'tenis',
      capacidade: 4,
      preco_hora: 80.00,
      status: 'ativa',
      descricao: 'Quadra de tênis com piso rápido'
    },
    {
      id: 'quadra_002',
      nome: 'Quadra 2 - Futsal',
      tipo: 'futsal',
      capacidade: 10,
      preco_hora: 60.00,
      status: 'ativa',
      descricao: 'Quadra de futsal coberta'
    },
    {
      id: 'quadra_003',
      nome: 'Quadra 3 - Beach Tennis',
      tipo: 'beach_tennis',
      capacidade: 4,
      preco_hora: 70.00,
      status: 'ativa',
      descricao: 'Quadra de beach tennis com areia'
    }
  ],
  
  professores: [
    {
      id: 'prof_001',
      nome: 'Roberto Silva',
      telefone: '11555555555',
      email: 'roberto@email.com',
      especialidade: 'Tênis',
      preco_hora: 50.00,
      status: 'ativo',
      created_at: new Date().toISOString()
    },
    {
      id: 'prof_002',
      nome: 'Fernanda Lima',
      telefone: '11444444444',
      email: 'fernanda@email.com',
      especialidade: 'Futsal',
      preco_hora: 45.00,
      status: 'ativo',
      created_at: new Date().toISOString()
    }
  ],
  
  reservas: [
    {
      id: 'reserva_001',
      cliente_id: 'cliente_001',
      quadra_id: 'quadra_001',
      professor_id: 'prof_001',
      data_inicio: '2025-01-15T14:00:00Z',
      data_fim: '2025-01-15T15:00:00Z',
      tipo: 'aula',
      status: 'confirmada',
      valor_total: 130.00,
      observacoes: 'Aula de tênis para iniciante'
    },
    {
      id: 'reserva_002',
      cliente_id: 'cliente_002',
      quadra_id: 'quadra_002',
      professor_id: 'prof_002',
      data_inicio: '2025-01-16T19:00:00Z',
      data_fim: '2025-01-16T20:00:00Z',
      tipo: 'locacao',
      status: 'pendente',
      valor_total: 60.00,
      observacoes: 'Locação para jogo entre amigos'
    }
  ],
  
  avaliacoes: [
    {
      id: 'aval_001',
      cliente_id: 'cliente_001',
      professor_id: 'prof_001',
      reserva_id: 'reserva_001',
      nota: 5,
      comentario: 'Excelente professor, muito didático!',
      created_at: new Date().toISOString()
    }
  ]
};

async function migrarDados() {
  console.log('🚀 INICIANDO MIGRAÇÃO DE DADOS PARA GOOGLE SHEETS\n');
  console.log('=' .repeat(60));
  
  let totalMigrados = 0;
  
  for (const [planilha, dados] of Object.entries(dadosExemplo)) {
    console.log(`\n📊 Migrando ${planilha.toUpperCase()}:`);
    console.log('-'.repeat(40));
    
    try {
      await appendRows(planilha, dados);
      console.log(`   ✅ ${dados.length} registros migrados com sucesso`);
      totalMigrados += dados.length;
    } catch (error) {
      console.log(`   ❌ Erro ao migrar ${planilha}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`🎉 MIGRAÇÃO CONCLUÍDA! ${totalMigrados} registros migrados no total`);
  console.log('\n💡 Próximo passo: Atualizar componentes para usar Google Sheets');
}

// Executar migração
migrarDados().catch(console.error);
