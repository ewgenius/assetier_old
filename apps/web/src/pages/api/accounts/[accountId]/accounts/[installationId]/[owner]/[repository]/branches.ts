import { NotAllowedError } from "@utils/httpErrors";
import { getOctokit } from "@utils/getOctokit";
import { withAccount } from "@utils/withAccount";

export default withAccount(async ({ method, query }, res) => {
  switch (method) {
    case "GET": {
      const installationId = Number(query.installationId);
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
