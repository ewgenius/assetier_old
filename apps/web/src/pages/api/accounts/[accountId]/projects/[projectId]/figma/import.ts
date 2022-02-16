import { runCors } from "@utils/corsMiddleware";
import { createBranch } from "@utils/createBranch";
import { createPullRequest } from "@utils/createPullRequest";
import { fetcher } from "@utils/fetcher";
import { getOctokit } from "@utils/getOctokit";
import { getProjectInstallation } from "@utils/getProjectInstallation";
import { getProjectRepository } from "@utils/getProjectRepository";
import { getRepositoryBranches } from "@utils/getRepositoryBranches";
import {
  BadRequestError,
  NotAllowedError,
  NotFoundError,
} from "@utils/httpErrors";
import { mergePullRequest } from "@utils/mergePullRequest";
import { parseFigmaUrl } from "@utils/parseFigmaUrl";
import { prisma } from "@utils/prisma";
import type { AssetMetaInfo } from "@assetier/types";
import { withProject } from "@utils/withProject";
import { v4 as uuidv4 } from "uuid";
import { uploadSVGFiles } from "@utils/uploadSVGFiles";
import { figma } from "@utils/figma";

export const handler = withProject(
  async ({ method, body, project, user }, res) => {
    switch (method) {
      case "POST": {
        if (!project.figmaFileUrl) {
          throw new NotFoundError("no connection details");
        }
        const figmaFileDetails = parseFigmaUrl(project.figmaFileUrl);
        if (!figmaFileDetails) {
          throw new NotFoundError("no figma file details");
        }

        const credentials = await prisma.figmaAuthCredentials.findUnique({
          where: {
            userId: user.id,
          },
        });

        if (!credentials) {
          throw new NotFoundError("no figma connection");
        }

        const selectedNodes = body.nodes as { id: string; name: string }[];
        const nodesMap = selectedNodes.reduce<
          Record<string, { id: string; name: string }>
        >((map, node) => {
          map[node.id] = node;
          return map;
        }, {});

        const svgs: { id: string; name: string; content: string }[] =
          await figma
            .fetch(
              `/v1/images/${figmaFileDetails.key}?ids=${selectedNodes
                .map((n) => n.id)
                .join(",")}&format=svg`,
              credentials
            )
            .then(
              (results: { images: { [key: string]: string }; err: any }) => {
                if (results.err) {
                  throw results.err;
                }
                return Promise.all(
                  Object.keys(results.images).map((key) => {
                    const url = results.images[key];
                    const nodeName = nodesMap[key].name;
                    const name = nodeName.endsWith(".svg")
                      ? nodeName
                      : `${nodeName}.svg`;
                    return fetch(url)
                      .then((r) => r.text())
                      .then((content) => ({
                        id: key,
                        name,
                        content,
                      }));
                  })
                );
              }
            );

        const installation = await getProjectInstallation(project);
        const octokit = await getOctokit(installation.installationId);
        const repository = await getProjectRepository(project, octokit);

        const baseBranchName = project.defaultBranch || "main";
        const merge = true;

        // TODO: request is paginated
        const branches = await getRepositoryBranches(repository, octokit);
        const baseBranch = branches.find((b) => b.name === baseBranchName);

        if (!baseBranch) {
          throw new BadRequestError(`Branch ${baseBranchName} does not exist`);
        }

        const branchName = `assetier/upload/${uuidv4()}`;
        const newBranch = await createBranch(
          repository,
          baseBranch.commit.sha,
          branchName,
          octokit
        );

        const updatedBranch = await uploadSVGFiles(
          project,
          repository,
          svgs,
          branchName,
          newBranch.object.sha,
          octokit
        );

        const pr = await createPullRequest(
          repository,
          baseBranchName,
          branchName,
          octokit
        );

        if (merge) {
          await mergePullRequest(repository, pr.number, octokit);
        }

        const results = svgs.reduce<Record<string, AssetMetaInfo>>(
          (map, svg) => {
            map[svg.id] = {
              repoOwner: repository.owner.login,
              repoName: repository.name,
              repoSha: updatedBranch.commit.sha,
              assetPath: `${project.assetsPath}/${svg.name}`,
              url: `https://github.com/${repository.owner.login}/${repository.name}/blob/${updatedBranch.commit.sha}/${project.assetsPath}/${svg.name}`,
            };
            return map;
          },
          {}
        );

        console.log(results);

        return res.status(200).json(results);
      }

      default: {
        throw new NotAllowedError();
      }
    }
  },
  runCors
);

export default handler;
