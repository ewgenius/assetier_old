import type {
  Middleware,
  NextApiHandlerWithProject,
  NextApiRequestWithProject,
} from "@assetier/types";
import { withAccount } from "@utils/withAccount";
import { getAccountProject } from "@utils/getAccountProject";

export const withProject = <T = any>(
  handler: NextApiHandlerWithProject<T>,
  middleware?: Middleware
) =>
  withAccount(async (req, res) => {
    const project = await getAccountProject(
      req.account.id,
      req.query.projectId as string
    );

    (req as NextApiRequestWithProject).project = project;

    return handler(req as NextApiRequestWithProject, res);
  }, middleware);
