/** @type {import('next').NextConfig} */

/* eslint-disable @typescript-eslint/no-var-requires */

const nextConfig = {
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

module.exports = async (...args) => {
  // XXX(Phong): apparently if we have a plugin, it might be trying to import
  // node packages, which will fail in the browser and the above `webpack`
  // config won't handle them all

  const plugins = [];
  return plugins.reduce((config, plugin) => {
    const appliedPlugin = plugin(config);
    return typeof appliedPlugin === 'function'
      ? appliedPlugin(...args)
      : appliedPlugin;
  }, nextConfig);
};
