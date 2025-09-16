export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({
    ok: true,
    serverEnv: {
      hasSUPABASE_URL: !!process.env.SUPABASE_URL,
      hasSERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    clientEnv: {
      hasPUBLIC_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasPUBLIC_ANON: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  })
}
