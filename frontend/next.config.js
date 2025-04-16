/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cryptologos.cc'],
  },
  i18n: {
    locales: ['tr'],
    defaultLocale: 'tr',
  },
};

module.exports = nextConfig;