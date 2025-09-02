/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@humanet/shared'],
  experimental: {
    esmExternals: true
  }
};

export default nextConfig;
