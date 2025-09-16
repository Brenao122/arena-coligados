/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: ["googleapis", "google-auth-library"],
}

export default nextConfig
