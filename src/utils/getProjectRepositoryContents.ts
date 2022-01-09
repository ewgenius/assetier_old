import type { Project } from "@prisma/client";
import { getOctokit } from "@utils/getOctokit";
import type { GithubFile, Repository } from "@utils/types";
import { getProjectInstallation } from "./getProjectInstallation";
import { getProjectRepository } from "@utils/getProjectRepository";
import type { Octokit } from "@octokit/core";

interface TreeNode {
  path?: string | undefined;
  mode?: string | undefined;
  type?: string | undefined;
  sha?: string | undefined;
  size?: number | undefined;
  url?: string | undefined;
}

async function getGithubTree(
  repository: Repository,
  octokit: Octokit,
  roots: TreeNode[],
  path: string,
  level = 0
) {
  const splitPath = path.split("/");
  const maxLevel = splitPath.length;

  const matchingFolderNode = roots.find(
    (node) => node.type === "tree" && node.path === splitPath[level]
  );

  if (level < maxLevel) {
    if (matchingFolderNode && matchingFolderNode.sha) {
      const tree = await octokit.request(
        "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
        {
          owner: repository.owner.login as string,
          repo: repository.name as string,
          tree_sha: matchingFolderNode.sha,
          // recursive: "true",
        }
      );

      return getGithubTree(
        repository,
        octokit,
        tree.data.tree,
        path,
        level + 1
      );
    }
  } else {
    const result = {};

    await Promise.all(
      roots
        .filter((r) => r.sha)
        .map((root) => {
          octokit
            .request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
              owner: repository.owner.login as string,
              repo: repository.name as string,
              tree_sha: root.sha as string,
            })
            .then(({ data }) => {
              console.log(level);
              data.tree.map((node) => {
                if (node.type === "blob") {
                  return;
                }
              });
            });
        })
    );
  }
}

export async function getProjectRepositoryContents(
  project: Project,
  branch?: string
) {
  const installation = await getProjectInstallation(project);
  const octokit = await getOctokit(installation.installationId);
  const repository = await getProjectRepository(project, octokit);

  const branchName = branch || project.defaultBranch;

  const currentBranch = await octokit.request(
    "GET /repos/{owner}/{repo}/git/ref/{ref}",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      ref: `heads/${branchName}`,
    }
  );

  const tree = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      tree_sha: currentBranch.data.object.sha,
      // recursive: "true",
    }
  );

  getGithubTree(repository, octokit, tree.data.tree, project.assetsPath, 0);

  // const result = tree.data.tree.reduce((map, item) => {
  //   if (item.path?.startsWith(project.assetsPath)) {
  //     console.log(item);
  //     if (item.type === "blob") {
  //       console.log(
  //         `https://raw.githubusercontent.com/${repository.owner.login}/${repository.name}/${branchName}/${tree.path}`
  //       );
  //     } else {
  //     }
  //   }
  //   return map;
  // }, {});

  const contents = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      path: project.assetsPath,
      ref: branchName,
    }
  );

  // console.log(contents.data);

  return contents.data;

  // const assets = (contents.data as GithubFile[]).filter((f) =>
  //   f.name.endsWith(".svg")
  // );

  // return assets;

  return [];
}
