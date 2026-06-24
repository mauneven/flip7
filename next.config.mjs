/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint is run separately; don't let stylistic lint fail production builds.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
