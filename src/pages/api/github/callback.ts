import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import * as path from "path";
import { App } from "@octokit/app";
import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const privateKey = await new Promise<string>((resolve, reject) =>
    fs.readFile(
      path.resolve("./assetier-dev.2021-12-11.private-key-2.pem"),
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.toString());
        }
      }
    )
  );

  // const auth = createAppAuth({
  //   appId: Number(process.env.GITHUB_APP_ID),
  //   privateKey,
  //   clientId: process.env.GITHUB_APP_CLIENT_ID,
  //   clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  // });

  // const appAuthentication = await auth({ type: "app" });

  // console.log(appAuthentication);

  // const app = new App({
  //   appId: Number(process.env.GITHUB_APP_ID),
  //   privateKey,
  //   // clientId: process.env.GITHUB_APP_CLIENT_ID,
  //   // clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  //   installationId: Number(context.query.installation_id),
  // });

  // for await (const { octokit, repository } of app.eachRepository.iterator()) {
  //   console.log(repository);
  // }

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: Number(process.env.GITHUB_APP_ID),
      privateKey,
      // clientId: process.env.GITHUB_APP_CLIENT_ID,
      // clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
      installationId: Number(req.query.installation_id),
    },
  });

  const result = await octokit.request("GET /user");
  console.log("authenticated as %s", result);

  // const { data: slug } = await app.octokit.rest.apps.getAuthenticated();
  // const octokit = await app.getInstallationOctokit(
  //   Number(context.query.installation_id)
  // );

  // console.log(slug, octokit);

  res.status(200).json({ name: "John Doe" });
}
