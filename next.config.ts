import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root so Turbopack doesn't treat the parent directory
  // (which contains a stray package-lock.json) as the workspace root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
