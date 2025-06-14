/** @type {import('next').NextConfig} */
const nextConfig = {
  // Убираем output: 'export' для поддержки динамических маршрутов
  // output: 'export',
  // distDir: 'dist',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  transpilePackages: ['@constructure/ui', '@constructure/types', '@constructure/utils'],
  assetPrefix: '',
  basePath: '',
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:8000/api',
  },
}

module.exports = nextConfig 