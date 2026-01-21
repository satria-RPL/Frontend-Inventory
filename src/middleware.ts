import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "auth_token";

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!tokenCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/main/:path*"],
};
