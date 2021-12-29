import { Project } from "@prisma/client";
import { getOctokit } from "@utils/getOctokit";
import type { GithubFile } from "@utils/types";
import { getProjectInstallation } from "./getProjectInstallation";
import { getProjectRepository } from "@utils/getProjectRepository";

export async function getProjectRepositoryContents(project: Project) {
  const installation = await getProjectInstallation(project);
  const octokit = await getOctokit(installation.installationId);
  const repository = await getProjectRepository(project, octokit);

  const contents = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      path: project.assetsPath,
    }
  );

  const assets = (contents.data as GithubFile[]).filter((f) =>
    f.name.endsWith(".svg")
  );

  return assets;
}
