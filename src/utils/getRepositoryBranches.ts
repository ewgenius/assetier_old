import type { Octokit } from "@octokit/core";

import { Repository } from "@utils/getProjectRepository";

export async function getRepositoryBranches(
  repository: Repository,
  octokit: Octokit
) {
  const branches = await octokit.request("GET /repos/{owner}/{repo}/branches", {
    owner: repository.owner.login as string,
    repo: repository.name as string,
  });

  return branches.data;
}
