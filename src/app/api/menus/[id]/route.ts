import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthTokenFromCookie } from "@/lib/session/authSession";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const normalizedApiBaseUrl = apiBaseUrl.replace(/\/$/, "");

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const backendUrl = `${normalizedApiBaseUrl}/api/menus/${params.id}`;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `${tokenType} ${token}`,
  };

  const body = await request.json().catch(() => null);

  try {
    const res = await fetch(backendUrl, {
      method: "PUT",
      headers,
      cache: "no-store",
      body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        data && typeof data === "object" && "message" in data
          ? String((data as { message?: unknown }).message)
          : "Gagal memperbarui menu.";
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
