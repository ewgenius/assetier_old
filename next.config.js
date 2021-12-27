/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: { type: "host", value: ":appDomain(.*).assetier.app" },
          destination: "www.assetier.app/public/:appDomain/:path*",
        },
      ],
    };
  },
};
