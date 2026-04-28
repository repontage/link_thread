const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js 16+ Turbopack 에러 방지 (withPWA 호환)
  webpack: (config) => config,
  turbopack: {},
};

module.exports = withPWA(nextConfig);
