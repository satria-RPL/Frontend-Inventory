import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthTokenFromCookie } from "@/lib/session/authSession";

const SESSION_COOKIE_NAME = "auth_token";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const normalizedApiBaseUrl = apiBaseUrl.replace(/\/$/, "");

const baseCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function GET(request: NextRequest) {
  if (normalizedApiBaseUrl) {
    try {
      const authPayload = await getAuthTokenFromCookie();
      const headers: HeadersInit = { Accept: "application/json" };
      if (authPayload?.token) {
        headers.Authorization = `${authPayload.tokenType ?? "Bearer"} ${
          authPayload.token
        }`;
      }
      await fetch(`${normalizedApiBaseUrl}/api/auth/logout`, {
        method: "POST",
        headers,
      });
    } catch {
      // Logout should still proceed even if API call fails.
    }
  }

  const response = NextResponse.redirect(new URL("/auth/login", request.url));
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...baseCookieOptions,
    maxAge: 0,
  });
  return response;
}
