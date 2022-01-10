import type { Octokit } from "@octokit/core";
import type { Repository } from "@assetier/types";

export async function createPullRequest(
  repository: Repository,
  baseBranchName: string,
  branchName: string,
  octokit: Octokit
) {
  const pr = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: repository.owner.login as string,
    repo: repository.name as string,
    title: "Assetier update",
    base: baseBranchName,
    head: branchName,
  });

  return pr.data;
}
