import { getBrowserClient } from "@/lib/supabase/browser-client"

export async function getUserWithRole() {
  const supabase = getBrowserClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr || !user) return { user: null, role: null }

  const { data: roleRow, error: roleErr } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  let role = roleRow?.role ?? null

  if (!role) {
    const { data: profileRow } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1).maybeSingle()
    role = profileRow?.role ?? "cliente" // default seguro
  }

  return { user, role }
}

