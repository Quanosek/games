/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "platform-lookaside.fbsbx.com" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "cdn.discordapp.com" },
    ],
  },
};

export default nextConfig;
