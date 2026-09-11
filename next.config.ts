import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/food", destination: "/Food" },
      { source: "/blog", destination: "/Blog" },
      { source: "/contact", destination: "/Contact" },
    ];
  },
};

export default nextConfig;
