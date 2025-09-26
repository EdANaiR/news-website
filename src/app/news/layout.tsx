import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import "@/app/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Güncel Manşet - Son Dakika Haberler, Güncel Haberler",
  description: "En güncel haberler",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        {/* AdSense script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7153216355008341"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main>{children}</main>
          <Footer />
          <SpeedInsights />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
