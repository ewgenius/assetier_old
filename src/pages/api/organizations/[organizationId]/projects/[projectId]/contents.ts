import type { ErrorResponse, GithubFile } from "@utils/types";
import { withProject } from "@utils/withProject";
import { getProjectRepositoryContents } from "@utils/getProjectRepositoryContents";

export default withProject<GithubFile[] | ErrorResponse>(
  async (req, res, { project }) => {
    switch (req.method) {
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
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);
