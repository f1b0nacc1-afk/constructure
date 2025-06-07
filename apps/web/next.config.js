/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  transpilePackages: ['@constructure/ui', '@constructure/types', '@constructure/utils'],
}

module.exports = nextConfig 