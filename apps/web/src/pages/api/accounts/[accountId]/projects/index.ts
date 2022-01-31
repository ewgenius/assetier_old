import type { Project } from "@assetier/prisma";
import { prisma } from "@utils/prisma";
import { withAccount } from "@utils/withAccount";
import { NotAllowedError } from "@utils/httpErrors";

export default withAccount<Project | Project[]>(
  async ({ method, body, account }, res) => {
    switch (method) {
      case "GET": {
        const projects = await prisma.project.findMany({
          where: {
            account,
          },
        });
        return res.status(200).send(projects);
      }

      case "POST": {
        const projectsCount = await prisma.project.count({
          where: {
            account,
          },
        });

        if (
          !account.subscription ||
          projectsCount >= account.subscription.subscriptionPlan.projectsLimit
        ) {
          throw new NotAllowedError("You reached projects limit");
        }

        const newProject = await prisma.project.create({
          data: {
            name: body.name as string,
            assetsPath: body.assetsPath,
            figmaFileUrl: body.figmaFileUrl,
            publicPageEnabled: body.publicPageEnabled,
            defaultBranch: body.defaultBranch,
            accountId: account.id,
            githubInstallationId: body.githubInstallationId,
            repositoryId: body.repositoryId,
          },
        });

        return res.status(200).json(newProject);
      }

      default: {
        throw new NotAllowedError();
      }
    }
  }
);
