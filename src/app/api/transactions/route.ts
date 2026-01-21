import type { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server/proxyRequest";

export async function GET(request: NextRequest) {
  return proxyApiRequest(request, "/api/transactions");
}

export async function POST(request: NextRequest) {
  return proxyApiRequest(request, "/api/transactions");
}
