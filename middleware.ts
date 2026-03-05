import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Admin route protection
  const isAdminLoginPage = path === "/admin/login" || path === "/admin/login/";
  if (path.startsWith("/admin") && !isAdminLoginPage) {
    const isLoggedIn = request.cookies.get("adminLoggedIn")?.value === "true";
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // User route protection
  const protectedUserRoutes = ["/profile", "/checkout", "/account", "/orders", "/order-detail", "/account-dashboard"];
  const isUserProtected = protectedUserRoutes.some(route => path.startsWith(route));
  const isUserLoginOrSignup = path === "/login" || path === "/register";
  if (isUserProtected && !isUserLoginOrSignup) {
    // Check for user session cookie (set this on login)
    const userLoggedIn = request.cookies.get("userLoggedIn")?.value === "true";
    if (!userLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile",
    "/checkout",
    "/account/:path*",
    "/orders",
    "/order-detail/:path*",
    "/account-dashboard",
  ],
};
