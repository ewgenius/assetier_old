import type { Project } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withOrganization } from "@utils/withOrganization";
import { NotAllowedError } from "@utils/httpErrors";

export default withOrganization<Project | Project[]>(
  async ({ method, body, organization }, res) => {
    switch (method) {
      case "GET": {
        const projects = await prisma.project.findMany({
          where: {
            organization,
          },
        });
        return res.status(200).send(projects);
      }

      case "POST": {
        const projectsCount = await prisma.project.count({
          where: {
            organization,
          },
        });

        if (projectsCount >= organization.organizationPlan.projectsLimit) {
          throw new NotAllowedError("You reached projects limit");
        }

        const newProject = await prisma.project.create({
          data: {
            name: body.name as string,
            assetsPath: body.assetsPath,
            figmaFileUrl: body.figmaFileUrl,
            figmaOauthConnectionId: body.figmaOauthConnectionId,
            publicPageEnabled: body.publicPageEnabled,
            defaultBranch: body.defaultBranch,
            organizationId: organization.id,
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
