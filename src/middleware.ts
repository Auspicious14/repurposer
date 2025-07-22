import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const PROTECTED_ROUTES = ["/dashboard", "/dashboard/*"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
 const isProtected = PROTECTED_ROUTES.some((route) =>
    route === pathname || (route.endsWith("/*") && pathname.startsWith(route.replace("/*", "")))
  );
  if (isProtected)
  ) {
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
  matcher: ["/((?!_next|api|login).*)"],
};
