// src/app/layout.tsx
import React from "react";
import "./globals.css"; // Eğer genel bir CSS dosyanız varsa ekleyin.

export const metadata = {
  title: "News Website",
  description: "News website layout",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
