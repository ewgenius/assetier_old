import { withProject } from "@utils/withProject";
import { HttpError, NotAllowedError } from "@utils/httpErrors";
import { getProjectInstallation } from "@utils/getProjectInstallation";
import { getOctokit } from "@utils/getOctokit";
import { getProjectRepository } from "@utils/getProjectRepository";
import type { GithubCommit } from "@utils/types";

export default withProject<GithubCommit[]>(
  async ({ method, project, query }, res) => {
    switch (method) {
      case "GET": {
        try {
          const installation = await getProjectInstallation(project);
          const octokit = await getOctokit(installation.installationId);
          const repository = await getProjectRepository(project, octokit);

          const commits = await octokit.request(
            "GET /repos/{owner}/{repo}/commits",
            {
              owner: repository.owner.login,
              repo: repository.name,
              path: query.path as string,
            }
          );

          // https://raw.githubusercontent.com/Assetier/icon-publihser/main/svg/streamline-icon-interface-edit-pin-2%4048x48.svg?token=AWVY4GX3BZDV6MEYDA6YP7LBZRJ4XAVPNFXHG5DBNRWGC5DJN5XF62LEZYAUX5GBWFUW443UMFWGYYLUNFXW4X3UPFYGLN2JNZ2GKZ3SMF2GS33OJFXHG5DBNRWGC5DJN5XA

          return res.status(200).send(
            commits.data.map((commit) => ({
              ...commit,
              file: {
                url: `https://github.com/{owner}/{repo}/blob/{commit.sha}/{path}`,
              },
            })) as GithubCommit[]
          );
        } catch (err: any) {
          throw new HttpError(err.error, err.status);
        }
      }

      default: {
        throw new NotAllowedError();
      }
    }
  }
);
