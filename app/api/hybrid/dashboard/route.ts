import 'server-only'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  // Teste básico de variáveis de ambiente
  const envVars = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    GOOGLE_SERVICE_EMAIL: !!process.env.GOOGLE_SERVICE_EMAIL,
    GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
    SHEETS_SPREADSHEET_ID: !!process.env.SHEETS_SPREADSHEET_ID,
  }

  return NextResponse.json(
    { 
      ok: true, 
      message: 'API funcionando - teste de variáveis de ambiente',
      envVars,
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}
