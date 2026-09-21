import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SECURITY_HEADERS } from "@/lib/security-headers";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  for (const header of SECURITY_HEADERS) {
    response.headers.set(header.key, header.value);
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
