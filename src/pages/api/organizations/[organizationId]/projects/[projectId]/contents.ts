import type { ErrorResponse, GithubFile } from "@utils/types";
import { withProject } from "@utils/withProject";
import { getProjectRepositoryContents } from "@utils/getProjectRepositoryContents";
import { NotAllowedError } from "@utils/httpErrors";

export default withProject<GithubFile[] | ErrorResponse>(
  async ({ method, project }, res) => {
    switch (method) {
      case "GET": {
        try {
          const contents = await getProjectRepositoryContents(project);
          return res.status(200).send(contents);
        } catch (err: any) {
          return res.status(err.status).send({
            error: err.error,
          });
        }
      }

      default: {
        throw new NotAllowedError();
      }
    }
  }
);
