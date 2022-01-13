import type { Project } from "@assetier/prisma";
import { getOctokit } from "@utils/getOctokit";
import type { GithubFile } from "@assetier/types";
import { getProjectInstallation } from "./getProjectInstallation";
import { getProjectRepository } from "@utils/getProjectRepository";

export async function getProjectRepositoryContents(
  project: Project,
  branchName?: string
) {
  const installation = await getProjectInstallation(project);
  const octokit = await getOctokit(installation.installationId);
  const repository = await getProjectRepository(project, octokit);

  const currentBranchName = branchName || project.defaultBranch;

  const contents = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      path: project.assetsPath,
      ref: currentBranchName,
    }
  );

  const branch = await octokit.request(
    "GET /repos/{owner}/{repo}/git/ref/{ref}",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      ref: `heads/${currentBranchName}`,
    }
  );

  const assets = (contents.data as GithubFile[])
    .filter((f) => f.name.endsWith(".svg"))
    .map((asset) => ({
      ...asset,
      download_url: asset.download_url.replace(
        currentBranchName,
        branch.data.object.sha
      ),
    }));

  return assets;
}
