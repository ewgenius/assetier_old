import { App } from "@octokit/app";
import { getGitHubPrivateKey } from "@utils/getGitHubPrivateKey";

export async function getGithubApp() {
  const privateKey = await getGitHubPrivateKey();

  const app = new App({
    appId: Number(process.env.GITHUB_APP_ID),
    privateKey,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  return app;
}
