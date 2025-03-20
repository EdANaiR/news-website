/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  experimental: {
    appDir: true,
    optimizeCss: false,
    // Cache kontrolü için eklenen kısım
    turboCaching: false,
    // Data fetch için cache kontrolü
    fetchCache: false,
  },
  // Environment variable'ları ekleyelim
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  optimizeFonts: true,
  swcMinify: true,
  // Cache kontrolü için eklenen kısım
  cache: false,
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
          // Cache kontrolü için eklenen headers
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

// Environment variable kontrolü ekleyelim
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    "Warning: NEXT_PUBLIC_API_URL is not defined in environment variables"
  );
}

module.exports = nextConfig;
