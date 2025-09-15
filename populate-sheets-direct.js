// populate-sheets-direct.js
// Script para popular Google Sheets diretamente

const { GoogleSpreadsheet } = require('google-spreadsheet')

async function populateSheets() {
  console.log('🚀 Populando Google Sheets diretamente...\n')

  try {
    // Configurações do Google Sheets
    const doc = new GoogleSpreadsheet('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms')
    
    // Autenticação com service account
    await doc.useServiceAccountAuth({
      client_email: 'arena-coligados@arena-coligados.iam.gserviceaccount.com',
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })

    await doc.loadInfo()
    console.log(`📊 Planilha carregada: ${doc.title}`)

    // Popular quadras
    console.log('\n🏟️ Populando quadras...')
    const quadrasSheet = doc.sheetsByTitle['Quadras']
    if (!quadrasSheet) {
      console.log('❌ Planilha Quadras não encontrada')
      return
    }

    await quadrasSheet.clear()
    await quadrasSheet.setHeaderRow(['nome', 'tipo', 'capacidade', 'preco_hora', 'descricao', 'ativo'])

    const quadras = [
      ['Quadra 1', 'Futebol Society', 14, 80.00, 'Quadra de futebol society com gramado sintético', true],
      ['Quadra 2', 'Futebol Society', 14, 80.00, 'Quadra de futebol society com gramado sintético', true],
      ['Quadra 3', 'Futebol 7', 16, 100.00, 'Quadra de futebol 7 com gramado natural', true]
    ]

    await quadrasSheet.addRows(quadras)
    console.log(`✅ ${quadras.length} quadras inseridas`)

    // Popular clientes
    console.log('\n👥 Populando clientes...')
    const clientesSheet = doc.sheetsByTitle['Clientes']
    if (clientesSheet) {
      await clientesSheet.clear()
      await clientesSheet.setHeaderRow(['nome', 'email', 'telefone', 'role', 'ativo'])

      const clientes = [
        ['João Silva', 'joao@email.com', '(11) 99999-1111', 'cliente', true],
        ['Maria Santos', 'maria@email.com', '(11) 99999-2222', 'cliente', true],
        ['Pedro Costa', 'pedro@email.com', '(11) 99999-3333', 'cliente', true],
        ['Ana Oliveira', 'ana@email.com', '(11) 99999-4444', 'cliente', true],
        ['Carlos Lima', 'carlos@email.com', '(11) 99999-5555', 'cliente', true]
      ]

      await clientesSheet.addRows(clientes)
      console.log(`✅ ${clientes.length} clientes inseridos`)
    }

    // Popular leads
    console.log('\n🎯 Populando leads...')
    const leadsSheet = doc.sheetsByTitle['Leads']
    if (leadsSheet) {
      await leadsSheet.clear()
      await leadsSheet.setHeaderRow(['nome', 'telefone', 'interesse', 'origem', 'status'])

      const leads = [
        ['João Silva', '(11) 99999-1111', 'Aula particular', 'Facebook', 'novo'],
        ['Maria Santos', '(11) 99999-2222', 'Locação', 'Instagram', 'contatado'],
        ['Pedro Costa', '(11) 99999-3333', 'Evento', 'Indicação', 'novo'],
        ['Ana Oliveira', '(11) 99999-4444', 'Aula particular', 'Google', 'convertido'],
        ['Carlos Lima', '(11) 99999-5555', 'Locação', 'Facebook', 'novo']
      ]

      await leadsSheet.addRows(leads)
      console.log(`✅ ${leads.length} leads inseridos`)
    }

    // Popular reservas
    console.log('\n📅 Populando reservas...')
    const reservasSheet = doc.sheetsByTitle['Reservas']
    if (reservasSheet) {
      await reservasSheet.clear()
      await reservasSheet.setHeaderRow(['cliente_nome', 'quadra_nome', 'data_inicio', 'data_fim', 'valor_total', 'status', 'tipo'])

      const reservas = [
        ['João Silva', 'Quadra 1', '2024-01-20 10:00:00', '2024-01-20 12:00:00', 160.00, 'confirmada', 'locacao'],
        ['Maria Santos', 'Quadra 2', '2024-01-21 14:00:00', '2024-01-21 16:00:00', 160.00, 'pendente', 'locacao'],
        ['Pedro Costa', 'Quadra 3', '2024-01-22 18:00:00', '2024-01-22 20:00:00', 200.00, 'confirmada', 'aula_particular'],
        ['Ana Oliveira', 'Quadra 1', '2024-01-23 09:00:00', '2024-01-23 11:00:00', 160.00, 'confirmada', 'locacao'],
        ['Carlos Lima', 'Quadra 2', '2024-01-24 15:00:00', '2024-01-24 17:00:00', 160.00, 'pendente', 'locacao']
      ]

      await reservasSheet.addRows(reservas)
      console.log(`✅ ${reservas.length} reservas inseridas`)
    }

    console.log('\n🎉 Google Sheets populado com sucesso!')
    console.log('   Agora você pode acessar a plataforma e ver os dados.')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

populateSheets()
