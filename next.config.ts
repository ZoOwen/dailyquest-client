/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Aktifkan App Router
  },
  webpack(config, { isServer }) {
    // Misalnya jika Anda ingin menonaktifkan fallback untuk fs atau module tertentu
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
