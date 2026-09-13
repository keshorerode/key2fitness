/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  optimizeFonts: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
