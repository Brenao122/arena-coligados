import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check all Google-related environment variables
    const envCheck = {
      GOOGLE_PRIVATE_KEY: {
        exists: !!process.env.GOOGLE_PRIVATE_KEY,
        length: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
        startsWithBegin: process.env.GOOGLE_PRIVATE_KEY?.startsWith("-----BEGIN PRIVATE KEY-----") || false,
        endsWithEnd: process.env.GOOGLE_PRIVATE_KEY?.endsWith("-----END PRIVATE KEY-----") || false,
        hasNewlines: process.env.GOOGLE_PRIVATE_KEY?.includes("\\n") || false,
        preview: process.env.GOOGLE_PRIVATE_KEY
          ? `${process.env.GOOGLE_PRIVATE_KEY.substring(0, 50)}...${process.env.GOOGLE_PRIVATE_KEY.substring(process.env.GOOGLE_PRIVATE_KEY.length - 50)}`
          : "NOT FOUND",
      },
      GOOGLE_SERVICE_ACCOUNT_EMAIL: {
        exists: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        value: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "NOT FOUND",
      },
      GOOGLE_SHEETS_SPREADSHEET_ID: {
        exists: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
        value: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "NOT FOUND",
      },
      VERCEL_ENV: process.env.VERCEL_ENV || "NOT SET",
      VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF || "NOT SET",
      NODE_ENV: process.env.NODE_ENV || "NOT SET",
    }

    // Test if we can create auth
    const authTest = {
      canCreateAuth: false,
      error: null as string | null,
    }

    try {
      const { GoogleAuth } = await import("google-auth-library")
      const auth = new GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })
      await auth.getClient()
      authTest.canCreateAuth = true
    } catch (error) {
      authTest.error = error instanceof Error ? error.message : String(error)
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      authTest,
      diagnosis: {
        privateKeyConfigured: envCheck.GOOGLE_PRIVATE_KEY.exists,
        privateKeyValid: envCheck.GOOGLE_PRIVATE_KEY.startsWithBegin && envCheck.GOOGLE_PRIVATE_KEY.endsWithEnd,
        emailConfigured: envCheck.GOOGLE_SERVICE_ACCOUNT_EMAIL.exists,
        canAuthenticate: authTest.canCreateAuth,
        likelyIssue: !envCheck.GOOGLE_PRIVATE_KEY.exists
          ? "GOOGLE_PRIVATE_KEY não está disponível no runtime"
          : !envCheck.GOOGLE_PRIVATE_KEY.startsWithBegin
            ? "GOOGLE_PRIVATE_KEY está mal formatada"
            : !authTest.canCreateAuth
              ? `Erro de autenticação: ${authTest.error}`
              : "Tudo parece estar configurado corretamente",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
