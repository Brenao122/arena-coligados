import { getBrowserClient } from "@/lib/supabase/browser-client"

export async function getUserWithRole() {
  const supabase = getBrowserClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr || !user) return { user: null, role: null }

  console.log("[v0] getUserWithRole - User ID:", user.id)
  console.log("[v0] getUserWithRole - User email:", user.email)

  const { data: allRoles } = await supabase.from("user_roles").select("user_id, role")
  console.log("[v0] getUserWithRole - All user_roles in database:", allRoles)

  // 1) tenta user_roles
  const { data: roleRow, error: roleErr } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  console.log("[v0] getUserWithRole - user_roles query result:", { roleRow, roleErr })
  console.log("[v0] getUserWithRole - Query was: SELECT role FROM user_roles WHERE user_id =", user.id)

  let role = roleRow?.role ?? null

  // 2) fallback controlado (opcional): profiles.role
  if (!role) {
    console.log("[v0] getUserWithRole - No role found in user_roles, trying profiles fallback")
    const { data: profileRow } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1).maybeSingle()
    console.log("[v0] getUserWithRole - profiles query result:", profileRow)
    role = profileRow?.role ?? "cliente" // default seguro
  }

  console.log("[v0] getUserWithRole - Final role:", role)
  return { user, role }
}
