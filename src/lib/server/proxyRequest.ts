import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthTokenFromCookie } from "@/lib/session/authSession";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const normalizedApiBaseUrl = apiBaseUrl.replace(/\/$/, "");

export async function proxyApiRequest(
  request: NextRequest,
  backendPath: string
) {
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

  const headers = new Headers(request.headers);
  headers.set("Accept", "application/json");
  headers.set(
    "Authorization",
    `${authPayload.tokenType ?? "Bearer"} ${authPayload.token}`
  );
  headers.delete("cookie");
  headers.delete("host");
  headers.delete("content-length");

  const url = new URL(request.url);
  const backendUrl = `${normalizedApiBaseUrl}${backendPath}${url.search}`;
  const method = request.method;

  const body =
    method === "GET" || method === "HEAD" ? undefined : await request.text();

  if (body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(backendUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data = await res.json().catch(() => null);
      return NextResponse.json(data, { status: res.status });
    }

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": contentType || "text/plain" },
    });
  } catch {
    return NextResponse.json(
      { message: "Koneksi ke server gagal." },
      { status: 500 }
    );
  }
}
