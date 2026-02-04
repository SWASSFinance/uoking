/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // Add image optimization settings
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    // Ensure static images are properly served
    domains: [],
    remotePatterns: [],
  },
  serverExternalPackages: ['pg'],
  experimental: {
    // Performance optimizations
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig