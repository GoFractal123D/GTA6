/** @type {import('next').NextConfig} */
import nextI18NextConfig from "./next-i18next.config.js";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  i18n: nextI18NextConfig.i18n,
};

export default nextConfig;
