/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60,
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "cdn.discordapp.com",
    ],
  },
};

export default nextConfig;
