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
        data.set(
          "client_secret",
          process.env.AUTH0_FIGMA_PLUGIN_CLIENT_SECRET as string
        );
        data.set("grant_type", "refresh_token");
        data.set("refresh_token", body.refreshToken);

        console.log(body, body.refreshToken, data);

        const result = await fetcher<Auth0DeviceToken>(
          `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
          {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: data,
          }
        );

        console.log(result);

        return res.status(200).json(result);
      }

      default: {
        throw new NotAllowedError();
      }
    }
  },
  [runCors]
);
