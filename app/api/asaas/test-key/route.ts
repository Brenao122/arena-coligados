import { type NextRequest, NextResponse } from "next/server"

async function testApiKey(unidade: string) {
  // Determinar qual chave usar baseado na unidade
  const apiKey =
    unidade === "Parque Amazônia" ? process.env.ASAAS_API_KEY_PARQUE_AMAZONIA : process.env.ASAAS_API_KEY_VILA_ROSA

  if (!apiKey) {
    return NextResponse.json(
      {
        valid: false,
        error: `Chave API não configurada para ${unidade}`,
        details: "Adicione a variável de ambiente correspondente",
      },
      { status: 400 },
    )
  }

  // Limpar a chave (remover espaços extras)
  const cleanApiKey = apiKey.trim()

  // Validar formato da chave
  if (!cleanApiKey.startsWith("$aact_")) {
    return NextResponse.json(
      {
        valid: false,
        error: "Formato de chave inválido",
        details: "A chave deve começar com $aact_prod_ ou $aact_sandbox_",
        keyPrefix: cleanApiKey.substring(0, 10) + "...",
      },
      { status: 400 },
    )
  }

  // Determinar URL baseado no tipo de chave
  const isProduction = cleanApiKey.includes("_prod_")
  const baseUrl = isProduction ? "https://api.asaas.com/v3" : "https://sandbox.asaas.com/api/v3"

  console.log("[v0] Testando chave API do Asaas...")
  console.log("[v0] Unidade:", unidade)
  console.log("[v0] Ambiente:", isProduction ? "Produção" : "Sandbox")
  console.log("[v0] URL:", baseUrl)
  console.log("[v0] Chave (primeiros 20 chars):", cleanApiKey.substring(0, 20) + "...")
  console.log("[v0] Chave (últimos 20 chars):", "..." + cleanApiKey.substring(cleanApiKey.length - 20))

  // Fazer uma requisição simples para testar a autenticação
  const response = await fetch(`${baseUrl}/myAccount`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      access_token: cleanApiKey,
    },
  })

  console.log("[v0] Status da resposta:", response.status)

  // Tentar ler a resposta
  const responseText = await response.text()
  console.log("[v0] Resposta (primeiros 500 chars):", responseText.substring(0, 500))

  if (!response.ok) {
    let errorData
    try {
      errorData = JSON.parse(responseText)
    } catch {
      errorData = { message: responseText }
    }

    return NextResponse.json(
      {
        valid: false,
        status: response.status,
        error: response.status === 401 ? "Chave API inválida ou sem permissões" : "Erro ao validar chave API",
        details: errorData,
        environment: isProduction ? "Produção" : "Sandbox",
        url: baseUrl,
      },
      { status: response.status },
    )
  }

  // Parse da resposta de sucesso
  const accountData = JSON.parse(responseText)
  console.log("[v0] Autenticação bem-sucedida!")
  console.log("[v0] Dados da conta:", accountData)

  return NextResponse.json({
    valid: true,
    message: "Chave API válida e funcionando!",
    environment: isProduction ? "Produção" : "Sandbox",
    account: {
      name: accountData.name,
      email: accountData.email,
      walletId: accountData.walletId,
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unidade = searchParams.get("unidade") || "Parque Amazônia"
    return await testApiKey(unidade)
  } catch (error) {
    console.error("[v0] Erro ao testar chave:", error)
    return NextResponse.json(
      {
        valid: false,
        error: "Erro ao testar chave API",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { unidade } = await request.json()
    return await testApiKey(unidade || "Parque Amazônia")
  } catch (error) {
    console.error("[v0] Erro ao testar chave:", error)
    return NextResponse.json(
      {
        valid: false,
        error: "Erro ao testar chave API",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
