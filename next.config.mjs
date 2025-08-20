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
  serverComponentsExternalPackages: ['pg'],
  experimental: {
    // Remove deprecated options
  },
  serverRuntimeConfig: {
    api: {
      bodyParser: {
        sizeLimit: '100mb',
      },
      responseLimit: false,
    },
  },
}

export default nextConfig