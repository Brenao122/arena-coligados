import { NextResponse } from "next/server"

export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      return NextResponse.json({
        erro: "GOOGLE_SHEETS_SPREADSHEET_ID não configurado",
      })
    }

    // URL da planilha
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`

    return NextResponse.json({
      sucesso: true,
      spreadsheetId,
      url,
      mensagem: "Clique no link acima para abrir a planilha no Google Sheets",
    })
  } catch (error: any) {
    return NextResponse.json({
      erro: error.message,
    })
  }
}
