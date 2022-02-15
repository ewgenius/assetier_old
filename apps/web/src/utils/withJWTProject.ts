import type {
  NextApiHandlerWithProject,
  NextApiRequestWithProject,
} from "@assetier/types";
import { getAccountProject } from "@utils/getAccountProject";
import { withJWTAccount } from "./withJWTAccount";

export const withJWTProject = <T = any>(
  handler: NextApiHandlerWithProject<T>
) =>
  withJWTAccount<T>(async (req, res) => {
    const project = await getAccountProject(
      req.account.id,
      req.query.projectId as string
    );

    (req as NextApiRequestWithProject).project = project;

    return handler(req as NextApiRequestWithProject, res);
  });
