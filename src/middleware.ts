import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
 const pathname = request.nextUrl.pathname;

 const publicPaths = ["/", "/login", "/register", "/auth", "/api", "/_next", "/campaigns", "/categories", "/about", "/contact", "/faq", "/search", "/forgot-password", "/reset-password", "/verify-email", "/pay"];

 const isPublicPath = publicPaths.some(
  (p) => pathname === p || pathname.startsWith(p + "/")
 );

 if (isPublicPath) {
  return NextResponse.next();
 }

 // For local auth, we rely on client-side session (localStorage).
 // Middleware allows all requests through; admin/dashboard pages
 // check auth client-side.
 return NextResponse.next();
}

export const config = {
 matcher: [
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
 ],
};
