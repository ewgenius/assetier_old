import type { Auth0DeviceCode } from "@assetier/types";
import { NotAllowedError } from "@utils/httpErrors";
import { runCors } from "@utils/corsMiddleware";
import { withMiddleware } from "@utils/withMiddleware";
import { fetcher } from "@utils/fetcher";

export default withMiddleware(
  async (req, res) => {
    const { method } = req;

    switch (method) {
      case "POST": {
        const data = new URLSearchParams();
        data.set(
          "client_id",
          process.env.AUTH0_FIGMA_PLUGIN_CLIENT_ID as string
        );
        data.set("audience", process.env.AUTH0_API_AUDIENCE as string);
        data.set("scope", "openid offline_access");

        const result = await fetcher<Auth0DeviceCode>(
          `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/device/code`,
          {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: data,
          }
        );

        return res.status(200).json(result);
      }

      default: {
        throw new NotAllowedError();
      }
    }
  },
  [runCors]
);
