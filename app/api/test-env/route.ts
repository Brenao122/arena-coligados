import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    GOOGLE_PRIVATE_KEY_EXISTS: !!process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_PRIVATE_KEY_LENGTH: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
    GOOGLE_PRIVATE_KEY_STARTS_WITH: process.env.GOOGLE_PRIVATE_KEY?.substring(0, 30) || "NOT_FOUND",
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "NOT_FOUND",
    GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "NOT_FOUND",
    ALL_ENV_KEYS: Object.keys(process.env).filter((key) => key.includes("GOOGLE")),
  }

  return NextResponse.json(envVars)
}
