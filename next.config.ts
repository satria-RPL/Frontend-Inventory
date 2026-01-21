import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const normalizedApiBaseUrl = apiBaseUrl.replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!normalizedApiBaseUrl) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${normalizedApiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
