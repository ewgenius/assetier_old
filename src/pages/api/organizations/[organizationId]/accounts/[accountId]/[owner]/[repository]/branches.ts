import { withProject } from "@utils/withProject";
import { HttpError, NotAllowedError } from "@utils/httpErrors";
import { getProjectInstallation } from "@utils/getProjectInstallation";
import { getOctokit } from "@utils/getOctokit";
import { withOrganization } from "@utils/withOrganization";

export default withOrganization(async ({ method, query }, res) => {
  switch (method) {
    case "GET": {
      const installationId = Number(query.accountId);
      const octokit = await getOctokit(installationId);
      const branches = await octokit.request(
        "GET /repos/{owner}/{repo}/branches",
        {
          owner: query.owner as string,
          repo: query.repository as string,
        }
      );

      return res.status(200).send(branches.data);
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
