/** @type {import('next').NextConfig} */
// eslint-disable-next-line
const path = require('path');

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

    // XXX(Phong): not sure why it doesn't just grab from tsconfig but this
    // is at the webpack level, so maybe after tsconfig is compiled. Anyway,
    // it doesn't read the tsconfig.json path aliases, so we define it here
    config.resolve.alias['~'] = path.join(__dirname, 'src');
    return config;
  },
};

module.exports = async () => {
  return nextConfig;
};
