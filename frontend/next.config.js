/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig = {
  output: "standalone",
  // Proxy /api/* to FastAPI so the browser only talks to Next.js (no CORS issues)
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
};

module.exports = nextConfig;
