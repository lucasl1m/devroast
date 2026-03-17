import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/image-response", "pg"],
};

export default nextConfig;
