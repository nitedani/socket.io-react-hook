const { IgnorePlugin } = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, options) => {
    if (options.isServer) {
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /^(bufferutil|utf-8-validate)$/,
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
