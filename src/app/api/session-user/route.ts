import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session/authSession";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json(user);
}
