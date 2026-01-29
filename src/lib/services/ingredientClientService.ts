"use client";

type ApiResult<T = unknown> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string; data?: unknown };

async function clientRequest<T = unknown>(path: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error:
          (data as Record<string, string>)?.message ??
          `Request gagal (${res.status})`,
        data,
      };
    }

    return { ok: true, status: res.status, data: data as T };
  } catch {
    return { ok: false, status: 500, error: "Koneksi ke server gagal" };
  }
}

export function fetchIngredientsClient() {
  return clientRequest("/api/ingredients");
}

export function fetchUnitsClient() {
  return clientRequest("/api/units");
}

export function fetchPlaceStocksClient() {
  return clientRequest("/api/place-stocks");
}
