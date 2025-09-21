// app/logout/route.ts
import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase/server-client"

export const runtime = "nodejs"

export async function POST() {
  const supa = getServerClient()
  await supa.auth.signOut()
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
}
