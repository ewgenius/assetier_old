import type { Octokit } from "@octokit/core";
import type { Project } from "@assetier/prisma";
import type { GHTree, Repository } from "@assetier/types";

export async function uploadSVGFiles(
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
