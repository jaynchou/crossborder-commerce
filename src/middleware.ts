import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, createAdminSessionValue } from "@/lib/adminAuth";

export async function middleware(request: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN;
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!adminToken) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  const expectedSession = await createAdminSessionValue(adminToken);
  if (session === expectedSession) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"]
};
