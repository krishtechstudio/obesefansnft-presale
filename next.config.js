/**
 * @type {import('next').NextConfig}
 */


const nextConfig = {
  reactStrictMode: false,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {fs: false, child_process: false};

    return config;
  }
}

module.exports = nextConfig
