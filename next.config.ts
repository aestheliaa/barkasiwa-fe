import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use standalone output in Docker/production
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
  
  // Allow network access for development
  experimental: {
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.103',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '**', // Allow any hostname for production flexibility
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow any hostname with HTTPS
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
