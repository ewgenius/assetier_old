/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  async rewrites() {
    return {
      beforeFiles: [
        // {
        //   source: "/",
        //   has: [{ type: "host", value: "feather.assetier.app" }],
        //   destination: "https://www.assetier.app/public/feather",
        // },
        {
          source: "/",
          has: [{ type: "host", value: ":project(.*).assetier.app" }],
          destination: "https://www.assetier.app/public/:project",
        },
      ],
    };
  },
};
