// lib/supabase/server-client.ts
import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function getServerClient() {
  const c = await cookies();

  const cookieStore = {
    get: (name: string) => c.get(name)?.value,
    set: (name: string, value: string, options: CookieOptions) =>
      c.set(name, value, options),
    remove: (name: string, options: CookieOptions) =>
      c.set(name, "", { ...options, maxAge: 0 }),
    getAll: () => c.getAll(),
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieStore }
  );
}
