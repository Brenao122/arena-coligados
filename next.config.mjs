/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: false }, // Habilitando ESLint para detectar erros
  typescript: {
    ignoreBuildErrors: false, // Habilitando verificação TypeScript
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['googleapis']
  }
}

export default nextConfig
