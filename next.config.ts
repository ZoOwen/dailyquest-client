import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Supaya ESLint error tidak menghentikan build di Vercel
  },
  webpack: (config, { isServer }) => {
    // Misalnya jika Anda ingin menonaktifkan fallback untuk fs atau module tertentu
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
