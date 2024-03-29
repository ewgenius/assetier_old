import type { Octokit } from "@octokit/core";
import type { Project } from "@assetier/prisma";
import { NotFoundError } from "@utils/httpErrors";
import type { Repository } from "@assetier/types";

export async function getProjectRepository(project: Project, octokit: Octokit) {
  const repository = await octokit.request("GET /repositories/{id}", {
    id: project.repositoryId,
  });

  if (!repository) {
    throw new NotFoundError("GH Repository not found");
  }

  return repository.data as Repository;
}
