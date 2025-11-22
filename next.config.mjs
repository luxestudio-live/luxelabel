/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/luxelabel' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/luxelabel/' : '',
  // eslint config removed (deprecated in Next.js)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
