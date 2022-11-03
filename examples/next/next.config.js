const { IgnorePlugin } = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, options) => {
    if (options.isServer) {
      // mark bufferutil and utf-8-validate as ssr externals
      config.plugins.push(
        new IgnorePlugin({
          checkResource: (resource) => {
            const lazyImports = ["bufferutil", "utf-8-validate"];
            if (!lazyImports.includes(resource)) {
              return false;
            }
            try {
              require.resolve(resource, {
                paths: [process.cwd()],
              });
            } catch (err) {
              return true;
            }
            return false;
          },
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
