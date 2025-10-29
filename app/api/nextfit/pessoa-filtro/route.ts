import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const codigoCliente = searchParams.get("codigoCliente")

  try {
    const response = await fetch(
      `https://app.nextfit.com.br/api/v1/Pessoa/GetClientes?codigoCliente=${codigoCliente}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXTFIT_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        erro: "Método não funciona",
        detalhes: String(error),
      },
      { status: 500 },
    )
  }
}
