// next.config.mjs
import createNextPlugin from 'next-transpile-modules';

const withTM = createNextPlugin(['@mui/x-data-grid']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withTM(nextConfig);