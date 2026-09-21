/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    return [
      {
        source: "/api/:path*",           // front-end requests to /api/...
        destination: `${backendUrl}/api/:path*`, // proxy to backend
      },
    ];
  },
};

module.exports = nextConfig;
