import type { Octokit } from "@octokit/core";
import type { Repository } from "@assetier/types";

export async function createBranch(
  repository: Repository,
  baseBranchSha: string,
  branchName: string,
  octokit: Octokit
) {
  const branch = await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner: repository.owner.login as string,
    repo: repository.name as string,
    ref: `refs/heads/${branchName}`,
    sha: baseBranchSha,
  });

  return branch.data;
}
