/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => {
    // Force a unique build ID every time to bust cache
    return `omega-build-${Date.now()}`
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ],
      },
    ]
  },
};

export default nextConfig;
