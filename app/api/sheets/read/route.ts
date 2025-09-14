import { NextResponse } from "next/server";
import { readSheet } from "@/lib/google-sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sheet = searchParams.get("sheet") || "reservas";
    const range = `${sheet}!A:Z`;

    const values = await readSheet(range);

    return NextResponse.json({ ok: true, values });
  } catch (err: any) {
    console.error("READ ERROR:", JSON.stringify(err, null, 2));
    return NextResponse.json(
      { ok: false, message: err.message ?? "Erro ao ler planilha" },
      { status: 500 }
    );
  }
}