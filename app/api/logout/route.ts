import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("adminToken", "", {
    path: "/",
    expires: new Date(0), // 🔥 delete cookie
  });

  return response;
}
