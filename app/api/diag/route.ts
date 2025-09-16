import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const site = process.env.NEXT_PUBLIC_SITE_URL

  let health = 'none'
  try {
    const res = await fetch(`${url}/auth/v1/health`, { cache: 'no-store' })
    health = `auth:${res.status}`
  } catch { health = 'auth:fetch_failed' }

  return NextResponse.json({
    ok: Boolean(url && anon && site),
    envs: { url: !!url, anon: !!anon, site: !!site },
    health,
  })
}
