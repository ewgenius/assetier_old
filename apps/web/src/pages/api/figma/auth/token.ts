import type { Auth0DeviceToken } from "@assetier/types";
import { NotAllowedError } from "@utils/httpErrors";
import { runCors } from "@utils/corsMiddleware";
import { withMiddleware } from "@utils/withMiddleware";
import { fetcher } from "@utils/fetcher";

export default withMiddleware(
  async (req, res) => {
    const { method, body } = req;

    switch (method) {
      case "POST": {
        const data = new URLSearchParams();
        data.set(
          "client_id",
          process.env.AUTH0_FIGMA_PLUGIN_CLIENT_ID as string
        );
        data.set("device_code", body.device_code);
        data.set("grant_type", "urn:ietf:params:oauth:grant-type:device_code");

        console.log(body, data);

        const result = await fetcher<Auth0DeviceToken>(
          `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
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
