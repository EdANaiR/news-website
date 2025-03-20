import type React from "react";
export const metadata = {
  title: "Bakım Çalışması - Güncel Manşet",
  description:
    "Güncel Manşet haber sitesi bakım çalışması nedeniyle geçici olarak erişime kapalıdır. En kısa sürede hizmetinize devam edeceğiz.",
};

export default function MaintenanceLayout({
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
