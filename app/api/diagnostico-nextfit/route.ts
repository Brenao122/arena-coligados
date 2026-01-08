import { NextResponse } from "next/server"

export async function GET() {
  const diagnostico: any = {
    timestamp: new Date().toISOString(),
    testes: [],
  }

  // Teste 1: Verificar se o token está configurado
  const token = process.env.NEXTFIT_API_KEY
  diagnostico.tokenConfigurado = !!token
  diagnostico.tokenLength = token?.length || 0
  diagnostico.tokenInicio = token ? `${token.substring(0, 10)}...` : "não configurado"

  if (!token) {
    return NextResponse.json({
      ...diagnostico,
      erro: "Token NEXTFIT_API_KEY não está configurado",
    })
  }

  // Teste 2: Testar endpoint GetClientes com diferentes headers
  const url = "https://app.nextfit.com.br/api/v1/Pessoa/GetClientes"

  // Teste 2a: Bearer Token (padrão)
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const contentType = response.headers.get("content-type")
    const isJson = contentType?.includes("application/json")

    let body
    if (isJson) {
      body = await response.json()
    } else {
      const text = await response.text()
      body = text.substring(0, 500) // Primeiros 500 caracteres
    }

    diagnostico.testes.push({
      nome: "Bearer Token com Content-Type",
      url,
      status: response.status,
      statusText: response.statusText,
      contentType,
      isJson,
      body,
    })
  } catch (error: any) {
    diagnostico.testes.push({
      nome: "Bearer Token com Content-Type",
      erro: error.message,
    })
  }

  // Teste 2b: Apenas Bearer Token (sem Content-Type)
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const contentType = response.headers.get("content-type")
    const isJson = contentType?.includes("application/json")

    let body
    if (isJson) {
      body = await response.json()
    } else {
      const text = await response.text()
      body = text.substring(0, 500)
    }

    diagnostico.testes.push({
      nome: "Bearer Token sem Content-Type",
      url,
      status: response.status,
      statusText: response.statusText,
      contentType,
      isJson,
      body,
    })
  } catch (error: any) {
    diagnostico.testes.push({
      nome: "Bearer Token sem Content-Type",
      erro: error.message,
    })
  }

  // Teste 2c: Token direto no header (sem Bearer)
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: token,
      },
    })

    const contentType = response.headers.get("content-type")
    const isJson = contentType?.includes("application/json")

    let body
    if (isJson) {
      body = await response.json()
    } else {
      const text = await response.text()
      body = text.substring(0, 500)
    }

    diagnostico.testes.push({
      nome: "Token direto (sem Bearer)",
      url,
      status: response.status,
      statusText: response.statusText,
      contentType,
      isJson,
      body,
    })
  } catch (error: any) {
    diagnostico.testes.push({
      nome: "Token direto (sem Bearer)",
      erro: error.message,
    })
  }

  // Teste 2d: Header customizado (caso a API use outro nome)
  try {
    const response = await fetch(url, {
      headers: {
        "X-API-Key": token,
      },
    })

    const contentType = response.headers.get("content-type")
    const isJson = contentType?.includes("application/json")

    let body
    if (isJson) {
      body = await response.json()
    } else {
      const text = await response.text()
      body = text.substring(0, 500)
    }

    diagnostico.testes.push({
      nome: "Header X-API-Key",
      url,
      status: response.status,
      statusText: response.statusText,
      contentType,
      isJson,
      body,
    })
  } catch (error: any) {
    diagnostico.testes.push({
      nome: "Header X-API-Key",
      erro: error.message,
    })
  }

  return NextResponse.json(diagnostico)
}
