import type { GithubInstallation } from "lib-prisma";

import { prisma } from "@utils/prisma";
import { withOrganization } from "@utils/withOrganization";
import { NotAllowedError } from "@utils/httpErrors";

export default withOrganization<GithubInstallation[]>(
  async ({ method, organization }, res) => {
    switch (method) {
      case "GET": {
        const accounts = await prisma.githubInstallation.findMany({
          where: {
            organization,
          },
        });
        return res.status(200).send(accounts);
      }

      default: {
        throw new NotAllowedError();
      }
    }
  }
);
