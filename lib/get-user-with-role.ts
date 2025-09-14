import { getBrowserClient } from "@/lib/supabase/browser-client"

export async function getUserWithRole() {
  const supabase = getBrowserClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr || !user) return { user: null, role: null }

  let role = null

  try {
    // Buscar role do usuário no Google Sheets
    const response = await fetch('/api/sheets/read?sheet=Usuarios')
    const result = await response.json()
    
    if (result.ok && result.values) {
      const usuarios = result.values.slice(1)
      const usuario = usuarios.find((u: any[]) => u[0] === user.id) // ID na coluna 0
      role = usuario?.[7] || "cliente" // role na coluna 7
    }
  } catch (error) {
    console.error('Erro ao buscar role do usuário:', error)
    role = "cliente" // default seguro
  }

  return { user, role }
}

