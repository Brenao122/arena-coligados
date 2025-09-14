import { NextResponse } from "next/server";
import { testConnection } from "@/lib/google-sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await testConnection();
    
    if (result.success) {
      return NextResponse.json({
        ok: true,
        title: result.title,
        sheets: result.sheets,
        message: result.message
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: result.message,
        error: result.error
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("PING ERROR:", error);
    return NextResponse.json({
      ok: false,
      message: error?.message || "Failed to connect to Google Sheets"
    }, { status: 500 });
  }
}
