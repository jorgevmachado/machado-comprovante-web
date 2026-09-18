import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@machado-repo/ui',
    '@machado-repo/i18n',
  ],
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
