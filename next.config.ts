import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/lienzo-blanco-demo" : "",
  assetPrefix: isGitHubPages ? "/lienzo-blanco-demo/" : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
