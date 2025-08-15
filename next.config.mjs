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
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
    responseLimit: false,
  },
}

export default nextConfig