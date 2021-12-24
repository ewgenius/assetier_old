import type { NextApiRequest, NextApiResponse } from "next";
import { App } from "@octokit/app";
import { getGithubPrivateKey } from "@utils/getGithubPrivateKey";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const privateKey = await getGithubPrivateKey();

  const app = new App({
    appId: Number(process.env.GITHUB_APP_ID),
    privateKey,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  console.log("query", req.query);
  console.log("body", req.body);

  // const octokit = await app.getInstallationOctokit(
  //   Number(req.query.installation_id)
  // );

  // const result = await octokit.request("GET /user");
  // console.log("authenticated as %s", result);

  res.status(200).json({ name: "John Doe" });
}
