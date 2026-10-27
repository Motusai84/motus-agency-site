import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;

if (process.env.MOTUS_LOCAL_PREVIEW !== "1") {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
