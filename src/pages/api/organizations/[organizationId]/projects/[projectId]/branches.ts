import { withProject } from "@utils/withProject";
import { HttpError, NotAllowedError } from "@utils/httpErrors";
import { getProjectInstallation } from "@utils/getProjectInstallation";
import { getOctokit } from "@utils/getOctokit";
import { getProjectRepository } from "@utils/getProjectRepository";
import { getRepositoryBranches } from "@utils/getRepositoryBranches";

export default withProject<any[]>(async ({ method, project }, res) => {
  switch (method) {
    case "GET": {
      try {
        const installation = await getProjectInstallation(project);
        const octokit = await getOctokit(installation.installationId);
        const repository = await getProjectRepository(project, octokit);
        const branches = await getRepositoryBranches(repository, octokit);

        return res.status(200).send(branches);
      } catch (err: any) {
        throw new HttpError(err.error, err.status);
      }
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
