// next.config.mjs
import createNextPlugin from 'next-transpile-modules';

const withTM = createNextPlugin(['@mui/x-data-grid']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/diwxwyq5k/**', // Le '/diwxwyq5k' est votre cloud name Cloudinary, il est important de le spécifier si vous voulez limiter le pattern. Le '**' signifie n'importe quel chemin après.
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withTM(nextConfig);