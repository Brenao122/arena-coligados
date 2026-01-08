"use client"

// Mock hook para compatibilidade após remoção do Supabase
export function useAuth() {
  return {
    user: null,
    profile: {
      id: "mock-user-id",
      name: "Usuário Mock",
      email: "usuario@example.com",
      full_name: "Usuário Mock",
    },
    loading: false,
    signIn: async () => ({ error: null }),
    signOut: async () => {},
    signUp: async () => ({ error: null }),
  }
}
