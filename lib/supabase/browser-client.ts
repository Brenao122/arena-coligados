// lib/supabase/browser-client.ts
"use client";
import { createBrowserClient } from "@supabase/ssr";

export const browserClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function getBrowserClient() {
  return browserClient;
}
