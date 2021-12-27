/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  rewrites: {
    beforeFiles: [
      {
        source: "/:path*",
        has: { type: "host", value: "(<appDomain>).public.assetier.app" },
        destination: "/public/:appDomain/:path*",
      },
    ],
  },
};
