import type { FigmaOauthConnection } from "@assetier/prisma";

import { prisma } from "@utils/prisma";
import { withOrganization } from "@utils/withOrganization";
import {
  ForbiddenError,
  NotAllowedError,
  NotFoundError,
} from "@utils/httpErrors";

export default withOrganization<FigmaOauthConnection>(
  async ({ method, organization, query }, res) => {
    switch (method) {
      case "DELETE": {
        const connection = await prisma.figmaOauthConnection.findUnique({
          where: {
            id: query.connectionId as string,
          },
        });

        if (!connection) {
          throw new NotFoundError();
        }

        if (connection.organizationId !== organization.id) {
          throw new ForbiddenError();
        }

        await prisma.figmaOauthConnection.delete({
          where: {
            id: query.connectionId as string,
          },
        });

        return res.status(200).send(connection);
      }

      default: {
        throw new NotAllowedError();
      }
    }
  }
);
