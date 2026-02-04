import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthTokenFromCookie } from "@/lib/session/authSession";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const normalizedApiBaseUrl = apiBaseUrl.replace(/\/$/, "");

type RouteContext = {
  params: Promise<{ id: string }>;
};

function buildAuthHeaders(token: string, tokenType?: string) {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `${tokenType ?? "Bearer"} ${token}`,
  } as const;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
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

  const { id } = await params;
  const backendUrl = `${normalizedApiBaseUrl}/api/roles/${encodeURIComponent(
    id
  )}`;

  try {
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: buildAuthHeaders(authPayload.token, authPayload.tokenType),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        data && typeof data === "object" && "message" in data
          ? String((data as { message?: unknown }).message)
          : "Gagal memuat detail role.";
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

export async function PATCH(request: NextRequest, { params }: RouteContext) {
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

  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const { id } = await params;
  const backendUrl = `${normalizedApiBaseUrl}/api/roles/${encodeURIComponent(
    id
  )}`;

  const doRequest = async (method: "PATCH" | "PUT") => {
    const res = await fetch(backendUrl, {
      method,
      headers: buildAuthHeaders(authPayload.token, authPayload.tokenType),
      body: JSON.stringify(payload ?? {}),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    return { res, data };
  };

  try {
    let { res, data } = await doRequest("PATCH");

    if (res.status === 404 || res.status === 405) {
      ({ res, data } = await doRequest("PUT"));
    }

    if (!res.ok) {
      const message =
        data && typeof data === "object" && "message" in data
          ? String((data as { message?: unknown }).message)
          : "Gagal memperbarui role.";
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

export async function DELETE(request: NextRequest, { params }: RouteContext) {
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

  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const { id } = await params;
  const backendUrl = `${normalizedApiBaseUrl}/api/roles/${encodeURIComponent(
    id
  )}`;

  try {
    const res = await fetch(backendUrl, {
      method: "DELETE",
      headers: buildAuthHeaders(authPayload.token, authPayload.tokenType),
      body: payload ? JSON.stringify(payload) : undefined,
      cache: "no-store",
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        data && typeof data === "object" && "message" in data
          ? String((data as { message?: unknown }).message)
          : "Gagal menghapus role.";
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
