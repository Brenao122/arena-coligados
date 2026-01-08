import { NextResponse } from "next/server"

export async function GET() {
  const requiredVars = [
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    "GOOGLE_PRIVATE_KEY",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
  ]

  const variables = requiredVars.map((name) => ({
    name,
    exists: !!process.env[name],
  }))

  const allExist = variables.every((v) => v.exists)

  return NextResponse.json({
    success: allExist,
    variables,
    message: allExist ? "Todas as variáveis estão configuradas" : "Algumas variáveis estão faltando",
  })
}
