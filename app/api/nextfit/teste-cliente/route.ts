import { type NextRequest, NextResponse } from "next/server"

const NEXTFIT_API_URL = "https://app.nextfit.com.br/api/v1"
const NEXTFIT_TOKEN = process.env.NEXTFIT_API_TOKEN

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const metodo = searchParams.get("metodo")
  const id = searchParams.get("id")

  if (!NEXTFIT_TOKEN) {
    return NextResponse.json({ erro: "Token não configurado" }, { status: 500 })
  }

  const headers = {
    Authorization: `Bearer ${NEXTFIT_TOKEN}`,
    "Content-Type": "application/json",
  }

  try {
    let url = ""

    switch (metodo) {
      case "pessoa-id":
        url = `${NEXTFIT_API_URL}/Pessoa/${id}`
        break

      case "cliente-id":
        url = `${NEXTFIT_API_URL}/Cliente/${id}`
        break

      case "pessoa-filtro":
        url = `${NEXTFIT_API_URL}/Pessoa/GetClientes?codigoCliente=${id}`
        break

      case "pessoa-filtro-id":
        url = `${NEXTFIT_API_URL}/Pessoa/GetClientes?id=${id}`
        break

      case "pessoa-buscar":
        url = `${NEXTFIT_API_URL}/Pessoa/Buscar?codigo=${id}`
        break

      case "todos-filtrar":
        // Busca todos os clientes
        url = `${NEXTFIT_API_URL}/Pessoa/GetClientes`
        const response = await fetch(url, { headers })
        const data = await response.json()

        // Filtra pelo ID
        const clienteEncontrado = data.items?.find(
          (c: any) => c.id === Number.parseInt(id || "0") || c.codigoCliente === Number.parseInt(id || "0"),
        )

        if (clienteEncontrado) {
          return NextResponse.json({
            sucesso: true,
            metodo: "Buscar todos e filtrar",
            cliente: clienteEncontrado,
          })
        } else {
          return NextResponse.json({
            sucesso: false,
            metodo: "Buscar todos e filtrar",
            mensagem: "Cliente não encontrado na lista",
            totalClientes: data.items?.length || 0,
          })
        }

      default:
        return NextResponse.json({ erro: "Método inválido" }, { status: 400 })
    }

    console.log("[v0] Testando URL:", url)

    const response = await fetch(url, { headers })

    // Verifica se a resposta é JSON
    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      const text = await response.text()
      return NextResponse.json({
        sucesso: false,
        metodo,
        erro: "Resposta não é JSON",
        statusCode: response.status,
        resposta: text.substring(0, 200),
      })
    }

    const data = await response.json()

    return NextResponse.json({
      sucesso: response.ok,
      metodo,
      statusCode: response.status,
      dados: data,
    })
  } catch (error: any) {
    console.error("[v0] Erro ao testar endpoint:", error)
    return NextResponse.json({
      sucesso: false,
      metodo,
      erro: error.message,
      detalhes: error.toString(),
    })
  }
}
