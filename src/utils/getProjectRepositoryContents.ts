import { Project } from "@prisma/client";
import { getOctokit } from "@utils/getOctokit";
import { prisma } from "@utils/prisma";
import type { GithubFile } from "@utils/types";
import { NotFoundError } from "./httpErrors";

export async function getProjectRepositoryContents(project: Project) {
  const installation = await prisma.githubInstallation.findUnique({
    where: {
      id: project.githubInstallationId,
    },
  });

  if (!installation) {
    throw new NotFoundError("GH Installation not found");
  }

  const octokit = await getOctokit(installation.installationId);
  const repository = await octokit.request("GET /repositories/{id}", {
    id: project.repositoryId,
  });

  if (!repository) {
    throw new NotFoundError("GH Repository not found");
  }

  const contents = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: repository.data.owner.login as string,
      repo: repository.data.name as string,
      path: project.assetsPath,
    }
  );

  const assets = (contents.data as GithubFile[]).filter((f) =>
    f.name.endsWith(".svg")
  );

  return assets;
}
