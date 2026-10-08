import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    '@machado-repo/ui',
    '@machado-repo/i18n',
  ],
};

export default nextConfig;
