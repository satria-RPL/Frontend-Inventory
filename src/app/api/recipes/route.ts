import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthTokenFromCookie } from "@/lib/session/authSession";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const normalizedApiBaseUrl = apiBaseUrl.replace(/\/$/, "");

export async function GET(request: NextRequest) {
  if (!normalizedApiBaseUrl) {
    return NextResponse.json(
      { message: "API_BASE_URL belum diset." },
      { status: 500 }
    );
  }

  const authPayload = await getAuthTokenFromCookie();
  let token = authPayload?.token ?? null;
  let tokenType = authPayload?.tokenType ?? "Bearer";

  if (!token) {
    const rawCookie = request.cookies.get("auth_token")?.value ?? null;
    if (rawCookie) {
      try {
        const parsed = JSON.parse(rawCookie) as { token?: string; tokenType?: string };
        token = parsed.token ?? rawCookie;
        tokenType = parsed.tokenType ?? tokenType;
      } catch {
        token = rawCookie;
      }
    }
  }

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const backendUrl = `${normalizedApiBaseUrl}/api/recipes${url.search}`;

  const headers: HeadersInit = {
    Accept: "application/json",
    Authorization: `${tokenType} ${token}`,
  };

  try {
    const res = await fetch(backendUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        data && typeof data === "object" && "message" in data
          ? String((data as { message?: unknown }).message)
          : "Gagal memuat resep.";
      return NextResponse.json({ message, data }, { status: res.status });
    }

    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Koneksi ke server gagal." },
      { status: 500 }
    );
  }
}
