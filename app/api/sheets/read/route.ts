import { NextResponse } from "next/server";
import { readSheet } from "@/lib/google-sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sheet = searchParams.get("sheet") || "Reservas";
    const range = `${sheet}!A:Z`;

    console.log(`Reading sheet: ${range}`);

    const values = await readSheet(range);

    return NextResponse.json({ 
      ok: true, 
      values,
      sheet,
      range,
      count: values.length
    });
  } catch (error: any) {
    console.error("READ ERROR:", error);
    return NextResponse.json({
      ok: false,
      message: error?.message || "Failed to read Google Sheet"
    }, { status: 500 });
  }
}