// scripts/populate-sheets-test-data.js
// Script para popular Google Sheets com dados de teste

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Configurações
const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

async function populateSheets() {
  try {
    console.log('🚀 Iniciando população das planilhas com dados de teste...');

    // Autenticação
    const serviceAccountAuth = new JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    console.log(`📊 Planilha carregada: ${doc.title}`);

    // =============================================
    // POPULAR QUADRAS
    // =============================================
    console.log('🏟️ Populando quadras...');
    
    let quadrasSheet;
    try {
      quadrasSheet = doc.sheetsByTitle['Quadras'];
    } catch (error) {
      quadrasSheet = await doc.addSheet({ title: 'Quadras' });
    }

    // Limpar dados existentes
    await quadrasSheet.clear();
    
    // Cabeçalhos
    await quadrasSheet.setHeaderRow([
      'id', 'nome', 'tipo', 'preco_hora', 'capacidade', 'ativa', 
      'descricao', 'regras', 'equipamentos', 'created_at', 'updated_at'
    ]);

    // Dados das quadras
    const quadrasData = [
      [
        '550e8400-e29b-41d4-a716-446655440001',
        'Quadra 1 - Matriz',
        'Beach Tennis',
        80.00,
        6,
        true,
        'Quadra de Beach Tennis com areia premium',
        'Capacidade máxima de 6 pessoas',
        'Rede oficial, Raquetes, Bolas',
        new Date().toISOString(),
        new Date().toISOString()
      ],
      [
        '550e8400-e29b-41d4-a716-446655440002',
        'Quadra 2 - Matriz',
        'Vôlei',
        80.00,
        10,
        true,
        'Quadra de Vôlei com piso profissional',
        'Capacidade máxima de 10 pessoas',
        'Rede oficial, Bolas oficiais',
        new Date().toISOString(),
        new Date().toISOString()
      ],
      [
        '550e8400-e29b-41d4-a716-446655440003',
        'Quadra 3 - Matriz',
        'Futevôlei',
        80.00,
        10,
        true,
        'Quadra de Futevôlei com areia especial',
        'Capacidade máxima de 10 pessoas',
        'Rede regulamentada, Bolas oficiais',
        new Date().toISOString(),
        new Date().toISOString()
      ]
    ];

    await quadrasSheet.addRows(quadrasData);
    console.log('✅ Quadras populadas com sucesso');

    // =============================================
    // POPULAR CLIENTES
    // =============================================
    console.log('👥 Populando clientes...');
    
    let clientesSheet;
    try {
      clientesSheet = doc.sheetsByTitle['Clientes'];
    } catch (error) {
      clientesSheet = await doc.addSheet({ title: 'Clientes' });
    }

    // Limpar dados existentes
    await clientesSheet.clear();
    
    // Cabeçalhos
    await clientesSheet.setHeaderRow([
      'id', 'email', 'nome', 'telefone', 'data_nascimento', 
      'endereco', 'role', 'ativo', 'created_at', 'updated_at'
    ]);

    // Dados dos clientes
    const clientesData = [
      [
        '650e8400-e29b-41d4-a716-446655440001',
        'joao.silva@email.com',
        'João Silva Santos',
        '(62) 99999-1111',
        '1990-05-15',
        'Rua das Flores, 123 - Centro - Goiânia/GO',
        'cliente',
        true,
        new Date().toISOString(),
        new Date().toISOString()
      ],
      [
        '650e8400-e29b-41d4-a716-446655440002',
        'maria.santos@email.com',
        'Maria Santos Oliveira',
        '(62) 99999-2222',
        '1985-08-22',
        'Av. Goiás, 456 - Setor Oeste - Goiânia/GO',
        'cliente',
        true,
        new Date().toISOString(),
        new Date().toISOString()
      ],
      [
        '650e8400-e29b-41d4-a716-446655440003',
        'carlos.lima@email.com',
        'Carlos Eduardo Lima',
        '(62) 99999-3333',
        '1992-12-03',
        'Rua 7, 789 - Setor Marista - Goiânia/GO',
        'cliente',
        true,
        new Date().toISOString(),
        new Date().toISOString()
      ],
      [
        '650e8400-e29b-41d4-a716-446655440004',
        'ana.costa@email.com',
        'Ana Paula Costa',
        '(62) 99999-4444',
        '1988-07-18',
        'Av. T-10, 321 - Setor Bueno - Goiânia/GO',
        'cliente',
        true,
        new Date().toISOString(),
        new Date().toISOString()
      ],
      [
        '650e8400-e29b-41d4-a716-446655440005',
        'pedro.oliveira@email.com',
        'Pedro Oliveira Silva',
        '(62) 99999-5555',
        '1995-03-25',
        'Rua 15, 654 - Setor Sul - Goiânia/GO',
        'cliente',
        true,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    ];

    await clientesSheet.addRows(clientesData);
    console.log('✅ Clientes populados com sucesso');

    // =============================================
    // POPULAR RESERVAS
    // =============================================
    console.log('📅 Populando reservas...');
    
    let reservasSheet;
    try {
      reservasSheet = doc.sheetsByTitle['Reservas'];
    } catch (error) {
      reservasSheet = await doc.addSheet({ title: 'Reservas' });
    }

    // Limpar dados existentes
    await reservasSheet.clear();
    
    // Cabeçalhos
    await reservasSheet.setHeaderRow([
      'id', 'cliente_id', 'quadra_id', 'professor_id', 'tipo',
      'data_inicio', 'data_fim', 'valor_total', 'status', 'observacoes', 'created_at'
    ]);

    // Dados das reservas
    const reservasData = [
      [
        '850e8400-e29b-41d4-a716-446655440001',
        '650e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440001',
        '750e8400-e29b-41d4-a716-446655440001',
        'aula',
        '2025-01-20T14:00:00.000Z',
        '2025-01-20T15:00:00.000Z',
        80.00,
        'confirmada',
        'Aula de Beach Tennis - Quadra 1',
        new Date().toISOString()
      ],
      [
        '850e8400-e29b-41d4-a716-446655440002',
        '650e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
        null,
        'locacao',
        '2025-01-21T16:00:00.000Z',
        '2025-01-21T18:00:00.000Z',
        160.00,
        'pendente',
        'Locação Quadra 2 - Vôlei',
        new Date().toISOString()
      ],
      [
        '850e8400-e29b-41d4-a716-446655440003',
        '650e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440003',
        '750e8400-e29b-41d4-a716-446655440002',
        'aula',
        '2025-01-22T10:00:00.000Z',
        '2025-01-22T11:00:00.000Z',
        80.00,
        'confirmada',
        'Aula de Futevôlei - Quadra 3',
        new Date().toISOString()
      ],
      [
        '850e8400-e29b-41d4-a716-446655440004',
        '650e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440001',
        null,
        'locacao',
        '2025-01-23T19:00:00.000Z',
        '2025-01-23T21:00:00.000Z',
        160.00,
        'confirmada',
        'Locação Quadra 1 - Beach Tennis',
        new Date().toISOString()
      ],
      [
        '850e8400-e29b-41d4-a716-446655440005',
        '650e8400-e29b-41d4-a716-446655440004',
        '550e8400-e29b-41d4-a716-446655440002',
        '750e8400-e29b-41d4-a716-446655440001',
        'aula',
        '2025-01-24T15:00:00.000Z',
        '2025-01-24T16:00:00.000Z',
        80.00,
        'pendente',
        'Aula de Vôlei - Quadra 2',
        new Date().toISOString()
      ]
    ];

    await reservasSheet.addRows(reservasData);
    console.log('✅ Reservas populadas com sucesso');

    // =============================================
    // POPULAR LEADS
    // =============================================
    console.log('🎯 Populando leads...');
    
    let leadsSheet;
    try {
      leadsSheet = doc.sheetsByTitle['Leads'];
    } catch (error) {
      leadsSheet = await doc.addSheet({ title: 'Leads' });
    }

    // Limpar dados existentes
    await leadsSheet.clear();
    
    // Cabeçalhos
    await leadsSheet.setHeaderRow([
      'id', 'nome', 'email', 'telefone', 'interesse', 
      'origem', 'status', 'observacoes', 'created_at'
    ]);

    // Dados dos leads
    const leadsData = [
      [
        '950e8400-e29b-41d4-a716-446655440001',
        'Roberto Alves',
        'roberto.alves@email.com',
        '(62) 99999-8888',
        'Aula de Beach Tennis',
        'instagram',
        'novo',
        'Interessado em aulas particulares',
        new Date().toISOString()
      ],
      [
        '950e8400-e29b-41d4-a716-446655440002',
        'Fernanda Lima',
        'fernanda.lima@email.com',
        '(62) 99999-9999',
        'Locação de quadra',
        'whatsapp',
        'contatado',
        'Quer alugar para aniversário',
        new Date().toISOString()
      ],
      [
        '950e8400-e29b-41d4-a716-446655440003',
        'Marcos Santos',
        'marcos.santos@email.com',
        '(62) 99999-0000',
        'Aula de Vôlei',
        'site',
        'qualificado',
        'Jogador experiente, quer melhorar técnica',
        new Date().toISOString()
      ],
      [
        '950e8400-e29b-41d4-a716-446655440004',
        'Juliana Costa',
        'juliana.costa@email.com',
        '(62) 99999-1111',
        'Futevôlei',
        'indicacao',
        'proposta',
        'Indicada por cliente atual',
        new Date().toISOString()
      ],
      [
        '950e8400-e29b-41d4-a716-446655440005',
        'Thiago Oliveira',
        'thiago.oliveira@email.com',
        '(62) 99999-2222',
        'Evento corporativo',
        'google',
        'convertido',
        'Empresa quer fazer evento de integração',
        new Date().toISOString()
      ]
    ];

    await leadsSheet.addRows(leadsData);
    console.log('✅ Leads populados com sucesso');

    console.log('🎉 Todas as planilhas foram populadas com sucesso!');
    console.log('📊 Dados inseridos:');
    console.log('   - 3 Quadras');
    console.log('   - 5 Clientes');
    console.log('   - 5 Reservas');
    console.log('   - 5 Leads');

  } catch (error) {
    console.error('❌ Erro ao popular planilhas:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  populateSheets()
    .then(() => {
      console.log('✅ Script executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na execução:', error);
      process.exit(1);
    });
}

module.exports = { populateSheets };
