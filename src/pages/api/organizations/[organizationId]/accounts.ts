import type { GithubInstallation, Project } from "@prisma/client";
import type { ErrorResponse } from "@utils/types";
import { prisma } from "@utils/prisma";
import { withOrganization } from "@utils/withOrganization";

export default withOrganization<GithubInstallation[] | ErrorResponse>(
  async (req, res, { organization }) => {
    switch (req.method) {
      case "GET": {
        const accounts = await prisma.githubInstallation.findMany({
          where: {
            organization,
          },
        });
        return res.status(200).send(accounts);
      }

      default: {
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);
