import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pins the workspace root explicitly. Without this, Turbopack scans
  // upward for lockfiles and can pick a stray one outside this project
  // (e.g. a parent directory's package-lock.json), causing pathological
  // multi-minute compiles from scanning unrelated directories.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
