import { prisma } from "@utils/prisma";
import type {
  Middleware,
  NextApiHandlerWithProject,
  NextApiRequestWithProject,
} from "@assetier/types";
import { ForbiddenError, NotFoundError } from "./httpErrors";
import { withAccount } from "./withAccount";

export const withProject = <T = any>(
  handler: NextApiHandlerWithProject<T>,
  middleware?: Middleware
) =>
  withAccount(async (req, res) => {
    const project = await prisma.project.findUnique({
      where: {
        id: req.query.projectId as string,
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found.");
    }

    if (project.accountId !== req.account.id) {
      throw new ForbiddenError();
    }

    (req as NextApiRequestWithProject).project = project;

    return handler(req as NextApiRequestWithProject, res);
  }, middleware);
