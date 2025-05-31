const { i18n } = require('./next-i18next.config');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
};

module.exports = nextConfig;


module.exports = {
  i18n,
  ...module.exports,
  compiler: {
    removeConsole: true,
  },
};
