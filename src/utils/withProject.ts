import { prisma } from "@utils/prisma";
import { withOrganization } from "@utils/withOrganization";
import type {
  NextApiHandlerWithProject,
  NextApiRequestWithProject,
} from "@utils/types";
import { ForbiddenError, NotFoundError } from "./httpErrors";

export const withProject = <T = any>(handler: NextApiHandlerWithProject<T>) =>
  withOrganization(async (req, res) => {
    const project = await prisma.project.findUnique({
      where: {
        id: req.query.projectId as string,
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found.");
    }

    if (project.organizationId !== req.organization.id) {
      throw new ForbiddenError();
    }

    (req as NextApiRequestWithProject).project = project;

    return handler(req as NextApiRequestWithProject, res);
  });
