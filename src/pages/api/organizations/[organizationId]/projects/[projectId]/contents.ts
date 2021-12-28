import type { GithubFile } from "@utils/types";
import { withProject } from "@utils/withProject";
import { getProjectRepositoryContents } from "@utils/getProjectRepositoryContents";
import { HttpError, NotAllowedError } from "@utils/httpErrors";

export default withProject<GithubFile[]>(async ({ method, project }, res) => {
  switch (method) {
    case "GET": {
      try {
        const contents = await getProjectRepositoryContents(project);
        return res.status(200).send(contents);
      } catch (err: any) {
        throw new HttpError(err.error, err.status);
      }
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
