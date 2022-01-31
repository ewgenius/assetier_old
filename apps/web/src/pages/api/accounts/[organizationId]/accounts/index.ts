import type { GithubInstallation } from "@assetier/prisma";

import { prisma } from "@utils/prisma";
import { NotAllowedError } from "@utils/httpErrors";
import { withAccount } from "@utils/withAccount";

export default withAccount<GithubInstallation[]>(
  async ({ method, account }, res) => {
    switch (method) {
      case "GET": {
        const accounts = await prisma.githubInstallation.findMany({
          where: {
            account,
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
