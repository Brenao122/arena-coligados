import { NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { GoogleSpreadsheet } from "google-spreadsheet"

const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"
const SERVICE_ACCOUNT_EMAIL = "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com"

function formatPrivateKey(key: string): string {
  console.log("[v0] === FORMATANDO CHAVE PRIVADA ===")
  console.log("[v0] Tamanho original:", key.length)
  console.log("[v0] Primeiros 50 caracteres:", key.substring(0, 50))

  let formatted = key.trim()

  const isBase64 = !formatted.includes("BEGIN PRIVATE KEY") && !formatted.includes("\\n") && formatted.length > 100

  if (isBase64) {
    try {
      console.log("[v0] Detectado formato Base64, decodificando...")
      formatted = Buffer.from(formatted, "base64").toString("utf-8")
      console.log("[v0] Chave decodificada de Base64 com sucesso")
      console.log("[v0] Tamanho após decodificação:", formatted.length)
    } catch (e) {
      console.error("[v0] ERRO ao decodificar Base64:", e)
      throw new Error("Falha ao decodificar chave Base64")
    }
  }

  // Remove aspas
  formatted = formatted.replace(/^["']|["']$/g, "")

  formatted = formatted.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n").replace(/\r/g, "\n")

  // Valida estrutura
  if (!formatted.includes("-----BEGIN PRIVATE KEY-----")) {
    console.error("[v0] ERRO: Chave não contém BEGIN PRIVATE KEY")
    console.error("[v0] Conteúdo atual:", formatted.substring(0, 200))
    throw new Error("Chave privada não contém o cabeçalho BEGIN PRIVATE KEY")
  }

  if (!formatted.includes("-----END PRIVATE KEY-----")) {
    console.error("[v0] ERRO: Chave não contém END PRIVATE KEY")
    throw new Error("Chave privada não contém o rodapé END PRIVATE KEY")
  }

  // Garante quebra de linha no final
  if (!formatted.endsWith("\n")) {
    formatted += "\n"
  }

  console.log("[v0] Chave formatada com sucesso")
  console.log("[v0] Número de linhas:", formatted.split("\n").length)
  console.log("[v0] Tem BEGIN?", formatted.includes("-----BEGIN PRIVATE KEY-----"))
  console.log("[v0] Tem END?", formatted.includes("-----END PRIVATE KEY-----"))

  return formatted
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sheetName, data } = body

    if (!sheetName || !data) {
      return NextResponse.json({ success: false, error: "sheetName e data são obrigatórios" }, { status: 400 })
    }

    console.log("[v0] === DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE ===")
    console.log("[v0] GOOGLE_PRIVATE_KEY_BASE64 existe?", !!process.env.GOOGLE_PRIVATE_KEY_BASE64)
    console.log("[v0] GOOGLE_PRIVATE_KEY_BASE64 tamanho:", process.env.GOOGLE_PRIVATE_KEY_BASE64?.length || 0)
    console.log("[v0] GOOGLE_PRIVATE_KEY existe?", !!process.env.GOOGLE_PRIVATE_KEY)
    console.log("[v0] GOOGLE_PRIVATE_KEY tamanho:", process.env.GOOGLE_PRIVATE_KEY?.length || 0)
    console.log("[v0] SERVICE_ACCOUNT_EMAIL:", SERVICE_ACCOUNT_EMAIL)
    console.log("[v0] SPREADSHEET_ID:", SPREADSHEET_ID)

    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY_BASE64 || process.env.GOOGLE_PRIVATE_KEY

    if (!rawPrivateKey) {
      console.error("[v0] ERRO: Nenhuma chave privada configurada!")
      return NextResponse.json(
        {
          success: false,
          error: "GOOGLE_PRIVATE_KEY não configurada",
          details: "Configure GOOGLE_PRIVATE_KEY_BASE64 ou GOOGLE_PRIVATE_KEY no Vercel",
        },
        { status: 500 },
      )
    }

    console.log(
      "[v0] Usando variável:",
      process.env.GOOGLE_PRIVATE_KEY_BASE64 ? "GOOGLE_PRIVATE_KEY_BASE64" : "GOOGLE_PRIVATE_KEY",
    )

    let privateKey: string
    try {
      privateKey = formatPrivateKey(rawPrivateKey)
    } catch (formatError) {
      console.error("[v0] ERRO CRÍTICO ao formatar chave:", formatError)
      return NextResponse.json(
        {
          success: false,
          error: "PRIVATE_KEY_FORMAT_ERROR",
          details: formatError instanceof Error ? formatError.message : "Erro ao formatar chave privada",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Criando GoogleAuth...")
    let auth: GoogleAuth
    try {
      auth = new GoogleAuth({
        credentials: {
          client_email: SERVICE_ACCOUNT_EMAIL,
          private_key: privateKey,
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })
      console.log("[v0] GoogleAuth criado com sucesso")
    } catch (authError) {
      console.error("[v0] ERRO ao criar GoogleAuth:", authError)
      const errorMessage = authError instanceof Error ? authError.message : String(authError)
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          errorType: "AUTH_CREATION_ERROR",
          hint: "A chave privada pode estar mal formatada ou corrompida",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Carregando documento...")
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)

    try {
      await doc.loadInfo()
      console.log("[v0] Documento carregado com sucesso. Título:", doc.title)
    } catch (loadError) {
      console.error("[v0] ERRO ao carregar documento:", loadError)
      const errorMessage = loadError instanceof Error ? loadError.message : String(loadError)

      if (errorMessage.includes("permission") || errorMessage.includes("403")) {
        return NextResponse.json(
          {
            success: false,
            error: "PERMISSION_DENIED",
            details: `A service account ${SERVICE_ACCOUNT_EMAIL} não tem permissão. Compartilhe a planilha com este email.`,
          },
          { status: 403 },
        )
      }

      throw loadError
    }

    const sheet = doc.sheetsByTitle[sheetName]
    if (!sheet) {
      console.log("[v0] Abas disponíveis:", Object.keys(doc.sheetsByTitle))
      return NextResponse.json(
        {
          success: false,
          error: `Aba "${sheetName}" não encontrada`,
          availableSheets: Object.keys(doc.sheetsByTitle),
        },
        { status: 404 },
      )
    }

    console.log("[v0] Adicionando linha...")
    await sheet.addRow(data)
    console.log("[v0] Linha adicionada com sucesso!")

    return NextResponse.json({
      success: true,
      message: "Dados adicionados com sucesso",
      sheetName,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] === ERRO FINAL ===")
    console.error("[v0] Tipo:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("[v0] Mensagem:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao adicionar dados",
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 },
    )
  }
}
