import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./lib/security-headers";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS.map((header) => ({ ...header })),
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
