import type { Octokit } from "@octokit/core";
import type { Repository, GithubMergedPullRequest } from "@assetier/types";

export async function mergePullRequest(
  repository: Repository,
  pullNumber: number,
  octokit: Octokit
): Promise<GithubMergedPullRequest> {
  const pr = await octokit.request(
    "PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      pull_number: pullNumber,
    }
  );

  return pr.data as GithubMergedPullRequest;
}
