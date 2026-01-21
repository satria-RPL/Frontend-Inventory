import type { NextRequest } from "next/server";
import { proxyApiRequest } from "@/lib/server/proxyRequest";

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const orderId = encodeURIComponent(params.orderId);
  return proxyApiRequest(request, `/api/orders/${orderId}/void`);
}
