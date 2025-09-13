require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

async function criarReservasTeste() {
  try {
    console.log('🎯 Criando reservas de teste na planilha...');
    
    // Configurar autenticação
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Primeiro, vamos verificar se existem clientes e quadras
    console.log('📋 Verificando dados existentes...');
    
    const [clientesRes, quadrasRes, professoresRes] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'clientes!A1:Z100'
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'quadras!A1:Z100'
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'professores!A1:Z100'
      })
    ]);

    const clientes = clientesRes.data.values || [];
    const quadras = quadrasRes.data.values || [];
    const professores = professoresRes.data.values || [];

    console.log(`👥 Clientes encontrados: ${clientes.length - 1}`);
    console.log(`🏟️ Quadras encontradas: ${quadras.length - 1}`);
    console.log(`👨‍🏫 Professores encontrados: ${professores.length - 1}`);

    // Se não houver dados, vamos criar alguns básicos
    if (clientes.length <= 1) {
      console.log('📝 Criando clientes de teste...');
      const clientesTeste = [
        ['id', 'nome', 'email', 'telefone', 'data_nascimento', 'endereco', 'status', 'data_cadastro'],
        ['cliente-001', 'João Silva', 'joao.silva@email.com', '(62) 99999-1111', '1990-05-15', 'Rua das Flores, 123', 'ativo', new Date().toISOString()],
        ['cliente-002', 'Maria Santos', 'maria.santos@email.com', '(62) 99999-2222', '1985-08-20', 'Av. Central, 456', 'ativo', new Date().toISOString()],
        ['cliente-003', 'Pedro Costa', 'pedro.costa@email.com', '(62) 99999-3333', '1992-12-10', 'Rua do Sol, 789', 'ativo', new Date().toISOString()]
      ];
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'clientes!A1:H4',
        valueInputOption: 'RAW',
        resource: { values: clientesTeste }
      });
      console.log('✅ Clientes de teste criados!');
    }

    if (quadras.length <= 1) {
      console.log('🏟️ Criando quadras de teste...');
      const quadrasTeste = [
        ['id', 'nome', 'tipo', 'capacidade', 'preco_hora', 'imagem_url', 'equipamentos', 'ativo'],
        ['quadra-001', 'Quadra 1 - Futsal', 'Futsal', 10, 80, '', 'Bola, cones, cronômetro', 'ativo'],
        ['quadra-002', 'Quadra 2 - Society', 'Society', 14, 100, '', 'Bola, traves, cronômetro', 'ativo'],
        ['quadra-003', 'Quadra 3 - Vôlei', 'Vôlei', 12, 70, '', 'Rede, bola, cronômetro', 'ativo']
      ];
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'quadras!A1:H4',
        valueInputOption: 'RAW',
        resource: { values: quadrasTeste }
      });
      console.log('✅ Quadras de teste criadas!');
    }

    if (professores.length <= 1) {
      console.log('👨‍🏫 Criando professores de teste...');
      const professoresTeste = [
        ['id', 'nome', 'email', 'telefone', 'especialidades', 'preco_aula', 'disponibilidade', 'ativo'],
        ['prof-001', 'Carlos Oliveira', 'carlos.oliveira@email.com', '(62) 99999-4444', 'Futsal, Society', 120, 'Manhã e Tarde', 'ativo'],
        ['prof-002', 'Ana Lima', 'ana.lima@email.com', '(62) 99999-5555', 'Vôlei, Futsal', 100, 'Tarde e Noite', 'ativo']
      ];
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'professores!A1:H3',
        valueInputOption: 'RAW',
        resource: { values: professoresTeste }
      });
      console.log('✅ Professores de teste criados!');
    }

    // Agora vamos criar as reservas de teste
    console.log('📅 Criando reservas de teste...');
    
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    
    const reservasTeste = [
      ['id', 'cliente_id', 'quadra_id', 'professor_id', 'data_inicio', 'data_fim', 'tipo', 'status', 'valor_total', 'observacoes', 'created_at'],
      [
        'reserva-001',
        'cliente-001',
        'quadra-001',
        'prof-001',
        `${amanha.toISOString().split('T')[0]} 14:00:00`,
        `${amanha.toISOString().split('T')[0]} 15:00:00`,
        'aula',
        'confirmada',
        200,
        'Aula de futsal para iniciantes',
        new Date().toISOString()
      ],
      [
        'reserva-002',
        'cliente-002',
        'quadra-002',
        'prof-002',
        `${amanha.toISOString().split('T')[0]} 16:00:00`,
        `${amanha.toISOString().split('T')[0]} 17:00:00`,
        'locacao',
        'pendente',
        100,
        'Locação para jogo entre amigos',
        new Date().toISOString()
      ],
      [
        'reserva-003',
        'cliente-003',
        'quadra-003',
        'prof-001',
        `${amanha.toISOString().split('T')[0]} 18:00:00`,
        `${amanha.toISOString().split('T')[0]} 19:00:00`,
        'aula',
        'confirmada',
        190,
        'Aula de vôlei avançado',
        new Date().toISOString()
      ],
      [
        'reserva-004',
        'cliente-001',
        'quadra-001',
        '',
        `${amanha.toISOString().split('T')[0]} 20:00:00`,
        `${amanha.toISOString().split('T')[0]} 21:00:00`,
        'locacao',
        'confirmada',
        80,
        'Jogo de futsal noturno',
        new Date().toISOString()
      ]
    ];

    // Verificar se já existem reservas
    const reservasExistentes = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'reservas!A1:Z100'
    });

    const reservas = reservasExistentes.data.values || [];
    
    if (reservas.length <= 1) {
      // Se não há reservas, criar com cabeçalho
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'reservas!A1:K5',
        valueInputOption: 'RAW',
        resource: { values: reservasTeste }
      });
    } else {
      // Se já existem reservas, adicionar apenas as novas
      const novasReservas = reservasTeste.slice(1); // Remove o cabeçalho
      await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'reservas!A:K',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: novasReservas }
      });
    }

    console.log('✅ Reservas de teste criadas com sucesso!');
    console.log('📋 Reservas criadas:');
    console.log('  1. João Silva - Quadra 1 (Futsal) - Aula com Carlos - Amanhã 14:00-15:00');
    console.log('  2. Maria Santos - Quadra 2 (Society) - Locação - Amanhã 16:00-17:00');
    console.log('  3. Pedro Costa - Quadra 3 (Vôlei) - Aula com Carlos - Amanhã 18:00-19:00');
    console.log('  4. João Silva - Quadra 1 (Futsal) - Locação - Amanhã 20:00-21:00');
    
    console.log('🔄 Agora teste a sincronização na plataforma!');

  } catch (error) {
    console.error('❌ Erro ao criar reservas de teste:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

criarReservasTeste();
