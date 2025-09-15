import 'server-only'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// NÃO use fallback nenhum aqui.
// A ideia é ver se a função recebe as ENVs MESMO.
export async function GET() {
  const envDump = {
    vercelEnv: process.env.VERCEL_ENV,               // 'production' | 'preview' | 'development'
    nodeEnv: process.env.NODE_ENV,                   // 'production'
    has: {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    lengths: {
      SERVICE_ROLE_LEN: process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0,
      ANON_LEN: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length ?? 0,
      URL_LEN: process.env.SUPABASE_URL?.length ?? 0,
    },
    // Mostra só um pedacinho pra validar que é seu projeto:
    snippets: {
      SUPABASE_URL_30: process.env.SUPABASE_URL?.slice(0, 30) ?? null,
      NEXT_PUBLIC_SUPABASE_URL_30: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) ?? null,
      SERVICE_ROLE_10: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 10) + '...'
        : null,
      ANON_10: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 10) + '...'
        : null,
    },
  }

  return NextResponse.json({ ok: true, envDump })
}
