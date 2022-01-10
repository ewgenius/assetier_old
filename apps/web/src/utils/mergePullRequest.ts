import type { Octokit } from "@octokit/core";
import type { Repository } from "lib-types";

export async function mergePullRequest(
  repository: Repository,
  pullNumber: number,
  octokit: Octokit
) {
  return octokit.request(
    "PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      pull_number: pullNumber,
    }
  );
}
