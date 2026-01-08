import { NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { GoogleSpreadsheet } from "google-spreadsheet"

const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"
const SERVICE_ACCOUNT_EMAIL = "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com"

export async function POST() {
  try {
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({
        success: false,
        error: "GOOGLE_PRIVATE_KEY não está configurada",
      })
    }

    const auth = new GoogleAuth({
      credentials: {
        client_email: SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)
    await doc.loadInfo()

    const sheet = doc.sheetsByTitle["reservas"]
    if (!sheet) {
      return NextResponse.json({
        success: false,
        error: 'Aba "reservas" não encontrada',
      })
    }

    await sheet.addRow({
      Data: new Date().toLocaleDateString("pt-BR"),
      Horário: "TESTE",
      Unidade: "TESTE",
      Quadra: "TESTE",
      Modalidade: "TESTE",
      Nome: "Teste de Diagnóstico",
      Telefone: "00000000000",
      Email: "teste@diagnostico.com",
      Valor: "0",
      Status: "TESTE",
      Timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Linha de teste adicionada com sucesso",
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}
