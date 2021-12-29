import type { Octokit } from "@octokit/core";
import type { Project } from "@prisma/client";
import { NotFoundError } from "@utils/httpErrors";

export interface Repository {
  owner: {
    login: string;
  };
  name: string;
}

export async function getProjectRepository(project: Project, octokit: Octokit) {
  const repository = await octokit.request("GET /repositories/{id}", {
    id: project.repositoryId,
  });

  if (!repository) {
    throw new NotFoundError("GH Repository not found");
  }

  return repository.data as Repository;
}
