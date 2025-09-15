import 'server-only'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  // NUNCA logue a key inteira
  const safeUrl = url ?? '(undefined)'
  const safeKeyInfo = key ? `len=${key.length}` : '(undefined)'

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, source: 'env', url: !!url, key: !!key, msg: 'missing SUPABASE_URL or SERVICE_ROLE_KEY' },
      { status: 500 }
    )
  }

  try {
    // ping direto no REST (só pra validar URL/conexão)
    const ping = await fetch(`${url}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    })

    return NextResponse.json(
      { ok: true, ping: { status: ping.status, url: safeUrl, key: safeKeyInfo } },
      { status: 200 }
    )
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, source: 'supabase', error: String(e?.message ?? e), url: safeUrl, key: safeKeyInfo },
      { status: 500 }
    )
  }
}
