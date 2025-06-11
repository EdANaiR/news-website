/** @type {import('next').NextConfig} */
const nextConfig = {
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  experimental: {
    appDir: true,
    optimizeCss: true,
    turboCaching: true,
    fetchCache: true,
  },
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
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "general-gabriella-edaprojects-53fb99e6.koyeb.app",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
    unoptimized: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  optimizeFonts: true,
  swcMinify: true,
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
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    "Warning: NEXT_PUBLIC_API_URL is not defined in environment variables"
  );
}

module.exports = nextConfig;
