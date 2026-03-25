import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  // 🔐 Your hardcoded check
  if (username === "rajprinters" && password === "raj@123") {
    const res = NextResponse.json({ success: true });

    // ✅ Set cookie
    res.cookies.set("adminToken", "authenticated", {
      httpOnly: true, // 🔥 cannot access via JS (secure)
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
