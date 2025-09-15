/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',

  // Correção: flag atualizada no Next 15
  serverExternalPackages: ["googleapis", "google-auth-library"],

  // Desabilitar prerendering para páginas com autenticação
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-key',
    SUPABASE_URL: 'https://placeholder.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'placeholder-service-key',
    GOOGLE_SERVICE_EMAIL: 'placeholder@example.com',
    GOOGLE_PRIVATE_KEY: 'placeholder-key',
    SHEETS_SPREADSHEET_ID: 'placeholder-sheet-id',
  },
};

export default nextConfig;
