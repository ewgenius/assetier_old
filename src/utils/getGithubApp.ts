import { App } from "@octokit/app";
import { getGithubPrivateKey } from "@utils/getGithubPrivateKey";

export async function getGithubApp() {
  const privateKey = await getGithubPrivateKey();

  const app = new App({
    appId: Number(process.env.GITHUB_APP_ID),
    privateKey,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  return app;
}
