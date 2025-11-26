import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ["cdn.aipagebuilder.local", "img.freepik.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.aipagebuilder.local",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
