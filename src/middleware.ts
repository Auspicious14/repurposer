import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const PROTECTED_ROUTES = ["/dashboard"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  
  // Debug logging
  console.log("Middleware - Path:", pathname);
  console.log("Middleware - Token exists:", !!token);
  console.log("Middleware - Token value:", token?.substring(0, 20) + "...");
  
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  if (isProtected) {
    console.log("Middleware - Protected route accessed");
    
    if (!token) {
      console.log("Middleware - No token, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log("Middleware - Token valid, user:", decoded);
    } catch (error) {
      console.log("Middleware - Token invalid:", error.message);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Auth-Status", token ? "true" : "false");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
