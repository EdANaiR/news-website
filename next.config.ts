/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["newsapi-nxxa.onrender.com", "guncelmanset.com.tr"], // Harici domainleri buraya ekleyin
    remotePatterns: [
      {
        protocol: "https",
        hostname: "newsapi-nxxa.onrender.com", // Harici hostname
        pathname: "/**", // Tüm yollar
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/news/:newsId",
        destination: "/news/:newsId/title",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
