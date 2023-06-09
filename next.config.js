/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const NODE_PACKAGES = [
        'child_process',
        'crypto',
        'fs',
        'http',
        'https',
        'net',
        'os',
        'path',
        'process',
        'stream',
        'tls',
        'util',
        'zlib',
      ];

      const externals = NODE_PACKAGES.reduce((acc, package) => {
        acc[package] = false;
        acc[`node:${package}`] = false;
        return acc;
      }, {});

      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...externals,
      };
    }
    return config;
  },
};

module.exports = async () => {
  return nextConfig;
};
