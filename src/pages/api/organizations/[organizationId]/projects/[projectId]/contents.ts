import { getOctokit } from "@utils/getOctokit";
import { prisma } from "@utils/prisma";
import type { ErrorResponse, GithubFile } from "@utils/types";
import { withProject } from "@utils/withProject";

export default withProject<any[] | ErrorResponse>(
  async (req, res, { project }) => {
    switch (req.method) {
      case "GET": {
        const installation = await prisma.githubInstallation.findUnique({
          where: {
            id: project.githubInstallationId,
          },
        });

        if (!installation) {
          return res.status(404).send({
            error: "GH Installation not found",
          });
        }

        const octokit = await getOctokit(installation.installationId);
        const repository = await octokit.request("GET /repositories/{id}", {
          id: project.repositoryId,
        });

        if (!repository) {
          return res.status(404).send({
            error: "GH Repository not found",
          });
        }

        const contents = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner: repository.data.owner.login as string,
            repo: repository.data.name as string,
            path: project.assetsPath,
          }
        );

        const assets = (contents.data as GithubFile[]).filter((f) =>
          f.name.endsWith(".svg")
        );

        return res.status(200).send(assets);
      }

      default: {
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);
