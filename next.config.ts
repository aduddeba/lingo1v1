import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enables compile-time type-safety for <Link href> values
  typedRoutes: true,
  allowedDevOrigins: ['192.168.1.159'],
};

export default nextConfig;
