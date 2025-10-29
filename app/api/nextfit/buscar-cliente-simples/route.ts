import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const codigoCliente = searchParams.get("codigoCliente")

  try {
    console.log("[v0] Buscando todos os clientes...")
    console.log("[v0] Token configurado:", !!process.env.NEXTFIT_API_KEY)

    // Busca todos os clientes (EXATAMENTE como em pessoa-todos/route.ts)
    const response = await fetch("https://app.nextfit.com.br/api/v1/Pessoa/GetClientes", {
      headers: {
        Authorization: `Bearer ${process.env.NEXTFIT_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Status da resposta:", response.status)
    console.log("[v0] Content-Type:", response.headers.get("content-type"))

    const data = await response.json()
    console.log("[v0] Dados recebidos:", data)

    // Filtra pelo codigoCliente se fornecido
    if (codigoCliente && data.items && Array.isArray(data.items)) {
      const clienteEncontrado = data.items.find((cliente: any) => String(cliente.id) === codigoCliente)

      return NextResponse.json({
        sucesso: true,
        metodo: "buscar-todos-simples",
        totalClientes: data.items.length,
        clienteEncontrado: clienteEncontrado || null,
        mensagem: clienteEncontrado
          ? `Cliente ${clienteEncontrado.nome} encontrado!`
          : `Cliente ${codigoCliente} não encontrado`,
      })
    }

    return NextResponse.json({
      sucesso: true,
      totalClientes: data.items?.length || 0,
      primeiros5: data.items?.slice(0, 5) || [],
    })
  } catch (error: any) {
    console.error("[v0] Erro:", error)
    return NextResponse.json(
      {
        sucesso: false,
        erro: error.message,
        detalhes: String(error),
      },
      { status: 500 },
    )
  }
}
