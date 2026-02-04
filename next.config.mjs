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
  // Empty turbopack config to silence Next.js 16+ warning
  turbopack: {},
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize bundle size
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    return config
  },
}

export default nextConfig