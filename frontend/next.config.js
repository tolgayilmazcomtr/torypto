/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  appDir: false,
  swcMinify: true,
  experimental: {
    appDir: false
  },
  images: {
    domains: ['cryptologos.cc'],
  },
  i18n: {
    locales: ['tr'],
    defaultLocale: 'tr',
  },
};

module.exports = nextConfig;