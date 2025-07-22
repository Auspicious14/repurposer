import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/signup"]; // Add this

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  const isAuthPage = AUTH_ROUTES.includes(pathname);
  
  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (isAuthPage && token) {
    try {
      jwt.verify(token, SECRET_KEY);
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch {
      // Token is invalid, continue to auth page
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }
  
  // Protect dashboard routes
  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
      jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Auth-Status", token ? "true" : "false");
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|_static|favicon.ico).*)"],
};
