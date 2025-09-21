import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"
const SERVICE_ACCOUNT_EMAIL = "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com"
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

const serviceAccountAuth = new JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
})

let doc: GoogleSpreadsheet | null = null

async function initializeSheet() {
  if (!doc) {
    doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth)
    await doc.loadInfo()
    console.log("[v0] Google Sheets conectado:", doc.title)
  }
  return doc
}

export async function readSheetData(sheetName: string) {
  try {
    const sheet = await initializeSheet()
    const worksheet = sheet.sheetsByTitle[sheetName]

    if (!worksheet) {
      throw new Error(`Aba '${sheetName}' não encontrada`)
    }

    const rows = await worksheet.getRows()
    console.log(`[v0] Lidos ${rows.length} registros da aba '${sheetName}'`)

    return rows.map((row) => row.toObject())
  } catch (error) {
    console.error(`[v0] Erro ao ler aba '${sheetName}':`, error)
    throw error
  }
}

export async function writeSheetData(sheetName: string, data: any[]) {
  try {
    const sheet = await initializeSheet()
    const worksheet = sheet.sheetsByTitle[sheetName]

    if (!worksheet) {
      throw new Error(`Aba '${sheetName}' não encontrada`)
    }

    await worksheet.addRows(data)
    console.log(`[v0] Adicionados ${data.length} registros na aba '${sheetName}'`)
  } catch (error) {
    console.error(`[v0] Erro ao escrever na aba '${sheetName}':`, error)
    throw error
  }
}

export async function updateSheetData(sheetName: string, rowIndex: number, data: any) {
  try {
    const sheet = await initializeSheet()
    const worksheet = sheet.sheetsByTitle[sheetName]

    if (!worksheet) {
      throw new Error(`Aba '${sheetName}' não encontrada`)
    }

    const rows = await worksheet.getRows()
    if (rows[rowIndex]) {
      Object.assign(rows[rowIndex], data)
      await rows[rowIndex].save()
      console.log(`[v0] Registro atualizado na aba '${sheetName}', linha ${rowIndex}`)
    }
  } catch (error) {
    console.error(`[v0] Erro ao atualizar aba '${sheetName}':`, error)
    throw error
  }
}

export async function listAllSheets() {
  try {
    const sheet = await initializeSheet()
    const sheets = Object.keys(sheet.sheetsByTitle)
    console.log("[v0] Abas disponíveis:", sheets)
    return sheets
  } catch (error) {
    console.error("[v0] Erro ao listar abas:", error)
    throw error
  }
}
