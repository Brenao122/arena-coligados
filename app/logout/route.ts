import { NextResponse } from 'next/server'

export async function POST() {
  // Limpar cookies e redirecionar
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  
  // Limpar cookies de autenticação
  response.cookies.delete('arena_user')
  
  return response
}
