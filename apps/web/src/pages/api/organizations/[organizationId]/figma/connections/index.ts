import type { FigmaOauthConnection } from "@assetier/prisma";

import { prisma } from "@utils/prisma";
import { withOrganization } from "@utils/withOrganization";
import { NotAllowedError } from "@utils/httpErrors";

export default withOrganization<FigmaOauthConnection[]>(
  async ({ method, organization }, res) => {
    switch (method) {
      case "GET": {
        const connections = await prisma.figmaOauthConnection.findMany({
          where: {
            organization,
          },
        });
        return res.status(200).send(connections);
      }

      default: {
        throw new NotAllowedError();
      }
    }
  }
);
