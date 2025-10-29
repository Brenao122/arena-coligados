import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST() {
  try {
    // Configurar autenticação do Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      return NextResponse.json({
        sucesso: false,
        erro: "GOOGLE_SHEETS_SPREADSHEET_ID não configurado",
      })
    }

    // Dados de teste realistas
    const dadosTeste = [
      {
        codigoCliente: 26613961,
        nome: "João Silva",
        telefone: "62999887766",
        email: "joao.silva@email.com",
        dataCadastro: "2025-10-29T10:00:00",
        codigoVenda: 26613961,
        statusVenda: "Concluida",
        descricaoVenda: "Plano Mensal - Academia",
      },
      {
        codigoCliente: 26613962,
        nome: "Maria Santos",
        telefone: "62988776655",
        email: "maria.santos@email.com",
        dataCadastro: "2025-10-29T10:15:00",
        codigoVenda: 26613962,
        statusVenda: "Concluida",
        descricaoVenda: "Plano Trimestral - Natação",
      },
      {
        codigoCliente: 26613963,
        nome: "Pedro Oliveira",
        telefone: "62977665544",
        email: "pedro.oliveira@email.com",
        dataCadastro: "2025-10-29T10:30:00",
        codigoVenda: 26613963,
        statusVenda: "Concluida",
        descricaoVenda: "Plano Anual - Musculação",
      },
    ]

    // Limpar planilha primeiro
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: "A:H",
    })

    // Preparar dados para inserir
    const valores = [
      // Cabeçalho
      ["codigoCliente", "nome", "telefone", "email", "dataCadastro", "codigoVenda", "statusVenda", "descricaoVenda"],
      // Dados
      ...dadosTeste.map((item) => [
        item.codigoCliente,
        item.nome,
        item.telefone,
        item.email,
        item.dataCadastro,
        item.codigoVenda,
        item.statusVenda,
        item.descricaoVenda,
      ]),
    ]

    // Inserir dados na planilha
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "A1",
      valueInputOption: "RAW",
      requestBody: {
        values: valores,
      },
    })

    return NextResponse.json({
      sucesso: true,
      mensagem: "Planilha populada com dados de teste!",
      totalRegistros: dadosTeste.length,
      dados: dadosTeste,
      proximoPasso: "Agora você pode testar o fluxo N8N buscando esses dados no Google Sheets",
    })
  } catch (error: any) {
    console.error("[v0] Erro ao popular planilha:", error)
    return NextResponse.json({
      sucesso: false,
      erro: error.message,
    })
  }
}
