import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";
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

  // TODO: specify default branch in the UI
  const branches = await octokit.request("GET /repos/{owner}/{repo}/branches", {
    owner: body.owner,
    repo: body.repository,
  });

  const sha = branches.data[0].commit.sha;

  console.log(sha);

  const branchName = `assetier/${uuidv4()}`;
  const newBranch = await octokit.request(
    "POST /repos/{owner}/{repo}/git/refs",
    {
      owner: body.owner,
      repo: body.repository,
      ref: `refs/heads/${branchName}`,
      sha,
    }
  );

  console.log(newBranch.data);

  const newFile = await octokit.request(
    "PUT /repos/{owner}/{repo}/contents/{path}",
    {
      owner: body.owner,
      repo: body.repository,
      path: body.path,
      message: "update from Assetier",
      content: Buffer.from(body.content).toString("base64"),
      branch: branchName,
    }
  );

  console.log(newFile.data);

  const pr = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: body.owner,
    repo: body.repository,
    title: "Assetier update",
    base: "main",
    head: branchName,
  });

  console.log(pr.data);

  res.status(200).json({ name: "John Doe" });
}
