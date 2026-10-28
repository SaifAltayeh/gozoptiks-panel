import type { NextConfig } from "next";

const API_URL = process.env.API_URL || "http://localhost:4000";
const SHOP_URL = process.env.SHOP_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` },
      { source: "/images/:path*", destination: `${SHOP_URL}/images/:path*` },
      { source: "/fonts/:path*", destination: `${SHOP_URL}/fonts/:path*` },
    ];
  },
};

export default nextConfig;
