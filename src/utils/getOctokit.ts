import { getGithubApp } from "@utils/getGithubApp";

export async function getOctokit(installationId: number) {
  const app = await getGithubApp();

  const octokit = await app.getInstallationOctokit(installationId);

  return octokit;
}
