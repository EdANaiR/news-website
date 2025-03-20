import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("MAINTENANCE_MODE değeri:", process.env.MAINTENANCE_MODE);

  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  if (
    request.nextUrl.pathname.startsWith("/maintenance") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  if (isMaintenanceMode) {
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

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
