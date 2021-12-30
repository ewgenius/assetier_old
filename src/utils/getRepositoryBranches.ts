import type { Octokit } from "@octokit/core";

import { Repository } from "@utils/getProjectRepository";

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection?: {
    url?: string;
    enabled?: boolean;
    required_status_checks?: {
      url?: string;
      enforcement_level?: string;
      contexts: string[];
      contexts_url?: string;
      strict?: boolean;
    };
  };
  protection_url?: string;
}

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
