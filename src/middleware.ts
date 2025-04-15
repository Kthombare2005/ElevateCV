import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || 
                      path === "/sign-in" || 
                      path === "/sign-up" || 
                      path === "/forgot-password";

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value || "";

  // Redirect logic
  if (path.startsWith("/analyze") && !token) {
    // Redirect to sign-in if trying to access protected route without token
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicPath && token) {
    // Redirect to analyze page if trying to access public route with token
    return NextResponse.redirect(new URL("/analyze", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/analyze/:path*",
  ],
}; 