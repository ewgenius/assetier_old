import type { Octokit } from "@octokit/core";
import type { Project } from "@assetier/prisma";
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
import type { AssetMetaInfo, GHTree, Repository } from "@assetier/types";
import { withProject } from "@utils/withProject";
import { v4 as uuidv4 } from "uuid";

async function uploadSVGFiles(
  project: Project,
  repository: Repository,
  files: { id: string; name: string; content: string }[],
  branchName: string,
  branchSha: string,
  octokit: Octokit
) {
  const treeForUpload = files.map<GHTree>((file, i) => ({
    path: project.assetsPath + "/" + file.name,
    mode: "100644",
    type: "blob",
    content: file.content,
  }));

  const baseCommit = await octokit.request(
    "GET /repos/{owner}/{repo}/git/commits/{commit_sha}",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      commit_sha: branchSha,
    }
  );

  const tree = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
    owner: repository.owner.login as string,
    repo: repository.name as string,
    tree: treeForUpload,
    base_tree: baseCommit.data.tree.sha,
  });

  const commit = await octokit.request(
    "POST /repos/{owner}/{repo}/git/commits",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      message: "update from Assetier",
      tree: tree.data.sha,
      parents: [branchSha],
    }
  );

  const updatedBranch = await octokit.request(
    "PATCH /repos/{owner}/{repo}/git/refs/{ref}",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      ref: `heads/${branchName}`,
      sha: commit.data.sha,
    }
  );

  return {
    commit: commit.data,
    updatedBranch: updatedBranch.data,
  };
}

export const handler = withProject(async ({ method, body, project }, res) => {
  switch (method) {
    case "POST": {
      if (!project.figmaOauthConnectionId || !project.figmaFileUrl) {
        throw new NotFoundError("no connection details");
      }
      const figmaFileDetails = parseFigmaUrl(project.figmaFileUrl);
      if (!figmaFileDetails) {
        throw new NotFoundError("no figma file details");
      }

      const connection = await prisma.figmaOauthConnection.findUnique({
        where: {
          id: project.figmaOauthConnectionId,
        },
      });

      if (!connection) {
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
        await fetcher(
          `https://api.figma.com/v1/images/${
            figmaFileDetails.key
          }?ids=${selectedNodes.map((n) => n.id).join(",")}&format=svg`,
          {
            headers: {
              Authorization: `Bearer ${connection?.accessToken}`,
            },
          }
        ).then((results: { images: { [key: string]: string }; err: any }) => {
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
        });

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

      const results = svgs.reduce<Record<string, AssetMetaInfo>>((map, svg) => {
        map[svg.id] = {
          repoOwner: repository.owner.login,
          repoName: repository.name,
          repoSha: updatedBranch.commit.sha,
          assetPath: `${project.assetsPath}/${svg.name}`,
          url: `https://github.com/${repository.owner.login}/${repository.name}/blob/${updatedBranch.commit.sha}/${project.assetsPath}/${svg.name}`,
        };
        return map;
      }, {});

      console.log(results);

      return res.status(200).json(results);
    }

    default: {
      throw new NotAllowedError();
    }
  }
}, runCors);

export default handler;
