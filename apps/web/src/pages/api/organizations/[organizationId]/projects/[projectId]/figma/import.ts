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
import type { GHTree, Repository } from "@assetier/types";
import { withProject } from "@utils/withProject";
import { v4 as uuidv4 } from "uuid";

async function uploadSVGFiles(
  project: Project,
  repository: Repository,
  files: string[],
  branchName: string,
  branchSha: string,
  octokit: Octokit
) {
  const treeForUpload = files.map<GHTree>((file, i) => ({
    path: project.assetsPath + "/" + i + ".svg",
    mode: "100644",
    type: "blob",
    content: file,
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

  return updatedBranch.data;
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

      const selectedNodeIds = body.nodes as string[];

      const svgs: string[] = await fetcher(
        `https://api.figma.com/v1/images/${
          figmaFileDetails.key
        }?ids=${selectedNodeIds.join(",")}&format=svg`,
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
          Object.values(results.images).map((url) => {
            return fetch(url).then((r) => r.text());
          })
        );
      });

      const installation = await getProjectInstallation(project);
      const octokit = await getOctokit(installation.installationId);
      const repository = await getProjectRepository(project, octokit);

      const baseBranchName = project.defaultBranch || "main";
      const merge = true;

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

      await uploadSVGFiles(
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

      return res.status(200).json({});
    }

    default: {
      throw new NotAllowedError();
    }
  }
}, runCors);

export default handler;
