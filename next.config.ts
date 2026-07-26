import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Lets the dev server serve HMR/_next/* assets when opened from another
  // device on the LAN (e.g. http://192.168.28.6:3000) instead of localhost —
  // Next blocks cross-origin dev requests by default for safety.
  allowedDevOrigins: [
    "192.168.28.134",
    "192.168.28.*",
    "192.168.1.4",
    "192.168.1.*",
    "192.168.0.*",
    "localhost:3000",
  ],
};

export default nextConfig;
