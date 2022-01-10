import type { GithubFile, OctokitError } from "lib-types";
import { withProject } from "@utils/withProject";
import { getProjectRepositoryContents } from "@utils/getProjectRepositoryContents";
import { HttpError, NotAllowedError } from "@utils/httpErrors";

export default withProject<GithubFile[]>(
  async ({ method, project, query }, res) => {
    switch (method) {
      case "GET": {
        try {
          const contents = await getProjectRepositoryContents(
            project,
            query.branch as string
          );
          return res.status(200).send(contents);
        } catch (err: unknown) {
          throw new HttpError(
            (err as OctokitError).error,
            (err as OctokitError).status
          );
        }
      }

      default: {
        throw new NotAllowedError();
      }
    }
  }
);
