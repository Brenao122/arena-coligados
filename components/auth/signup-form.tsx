import { supabase } from "path/to/supabase" // Assuming supabase is imported from a module

const handleSignUp = async (email: string, password: string, fullName: string) => {
  try {
    const { data: existingProfile } = await supabase.from("profiles").select("id, email").eq("email", email).single()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error

    if (existingProfile && data.user) {
      await supabase.from("profiles").update({ id: data.user.id }).eq("email", email)

      await supabase.from("user_roles").update({ user_id: data.user.id }).eq("user_id", existingProfile.id)
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
