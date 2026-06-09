import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.nhle.com" },
      { protocol: "https", hostname: "cms.nhl.bamgrid.com" },
      { protocol: "https", hostname: "www.nhl.com" },
      { protocol: "https", hostname: "**.nhle.com" },
    ],
  },
};

export default nextConfig;
