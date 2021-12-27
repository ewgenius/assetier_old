/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [{ type: "host", value: "feather.assetier.app" }],
          destination: "https://www.assetier.app/public/feather/:path*",
        },
        {
          source: "/:path*",
          has: [{ type: "host", value: ":appDomain(.*).assetier.app" }],
          destination: "https://www.assetier.app/public/:appDomain/:path*",
        },
      ],
    };
  },
};
