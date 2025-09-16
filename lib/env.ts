// lib/env.ts
const must = (name: string) => {
  const v = process.env[name]
  if (!v) throw new Error(`Missing ENV: ${name}`)
  return v
}

export const ENV = {
  // público (client)
  NEXT_PUBLIC_SUPABASE_URL: must('NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: must('NEXT_PUBLIC_SUPABASE_ANON_KEY'),

  // servidor
  SUPABASE_URL: must('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: must('SUPABASE_SERVICE_ROLE_KEY'),

  NEXT_PUBLIC_SITE_URL: must('NEXT_PUBLIC_SITE_URL'),
  AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN || '',
  AUTH_COOKIE_SECURE: String(process.env.AUTH_COOKIE_SECURE || 'true') === 'true',

  GOOGLE_PRIVATE_KEY: must('GOOGLE_PRIVATE_KEY'),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: must('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
  GOOGLE_SHEETS_SPREADSHEET_ID: must('GOOGLE_SHEETS_SPREADSHEET_ID'),
} as const
