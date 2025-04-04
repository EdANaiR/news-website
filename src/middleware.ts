import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  if (
    request.nextUrl.pathname.startsWith("/maintenance") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    console.log("Özel route'lar atlandı:", request.nextUrl.pathname);
    return NextResponse.next();
  }

  if (isMaintenanceMode) {
    console.log("Bakım modu aktif, yönlendiriliyor...");
    const maintenanceUrl = new URL("/maintenance", request.url);

    const response = NextResponse.redirect(maintenanceUrl);

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  }

  console.log("Normal mod, devam ediliyor...");
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
