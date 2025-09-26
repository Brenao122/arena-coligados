// lib/supabase/get-user-with-role.ts
import "server-only";
import { getServerClient } from "./server-client";

export async function getUserWithRole() {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { user: null, role: null };

  // Buscar role do usuÃ¡rio
  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  let role = roleRow?.role ?? null;

  // Fallback para profiles.role se nÃ£o encontrar em user_roles
  if (!role) {
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .limit(1)
      .maybeSingle();
    role = profileRow?.role ?? null;
  }

  return { user, role };
}
