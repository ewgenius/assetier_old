import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import * as path from "path";
import { App } from "@octokit/app";
import { getSession } from "next-auth/react";
import { getGitHubPrivateKey } from "@utils/getGitHubPrivateKey";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const privateKey = await getGitHubPrivateKey();
  const session = await getSession({ req });

  if (!session) {
    res.status(401).send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }

  const app = new App({
    appId: Number(process.env.GITHUB_APP_ID),
    privateKey,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  const octokit = await app.getInstallationOctokit(
    Number(req.query.installation_id)
  );

  const body = JSON.parse(req.body);
  console.log(body);

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: body.owner,
    repo: body.repository,
    path: body.path,
    message: "update from Assetier",
    content: Buffer.from(body.content).toString("base64"),
  });

  res.status(200).json({ name: "John Doe" });
}
