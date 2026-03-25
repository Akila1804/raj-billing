import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("adminToken");

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/tally",
    "/invoice",
    "/estimation",
    "/add-estimation",
    "/add-invoice",
    "/preview-estimation",
    "/preview-invoice",
    "/tally-details",
    "/update-estimation",
    "/update-invoice",
  ],
};
