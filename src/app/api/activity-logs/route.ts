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
  if (!authPayload?.token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const candidates = [
    `${normalizedApiBaseUrl}/api/activity_logs${url.search}`,
    `${normalizedApiBaseUrl}/api/activity-logs${url.search}`,
    `${normalizedApiBaseUrl}/activity_logs${url.search}`,
    `${normalizedApiBaseUrl}/activity-logs${url.search}`,
  ];

  const headers: HeadersInit = {
    Accept: "application/json",
    Authorization: `${authPayload.tokenType ?? "Bearer"} ${authPayload.token}`,
  };

  try {
    let lastErrorPayload: unknown = null;
    let lastStatus = 500;

    for (const backendUrl of candidates) {
      const res = await fetch(backendUrl, {
        method: "GET",
        headers,
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        return NextResponse.json(data, { status: res.status });
      }

      lastErrorPayload = data;
      lastStatus = res.status;

      if (res.status !== 404) {
        const message =
          data && typeof data === "object" && "message" in data
            ? String((data as { message?: unknown }).message)
            : "Gagal memuat activity logs.";
        return NextResponse.json({ message, data }, { status: res.status });
      }
    }

    const message =
      lastErrorPayload && typeof lastErrorPayload === "object" && "message" in lastErrorPayload
        ? String((lastErrorPayload as { message?: unknown }).message)
        : "Endpoint activity logs tidak ditemukan.";
    return NextResponse.json(
      { message, data: lastErrorPayload },
      { status: lastStatus }
    );
  } catch {
    return NextResponse.json(
      { message: "Koneksi ke server gagal." },
      { status: 500 }
    );
  }
}
