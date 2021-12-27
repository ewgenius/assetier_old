/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "feather.assetier.app" }],
          destination: "https://www.assetier.app/public/feather",
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
