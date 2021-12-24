import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";
import { App } from "@octokit/app";
import { getSession } from "next-auth/react";
import formidable, { Files, Fields, File as FFile } from "formidable";
import { getGithubPrivateKey } from "@utils/getGithubPrivateKey";
import PersistentFile from "formidable/PersistentFile";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const privateKey = await getGithubPrivateKey();
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

  const form = formidable({});
  const { body, files } = await new Promise<{ body: Fields; files: Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        resolve({
          body: fields,
          files,
        });
      });
    }
  );

  const branches = await octokit.request("GET /repos/{owner}/{repo}/branches", {
    owner: body.owner as string,
    repo: body.repository as string,
  });

  const sha = branches.data[0].commit.sha;
  const branchName = `assetier/${uuidv4()}`;
  await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner: body.owner as string,
    repo: body.repository as string,
    ref: `refs/heads/${branchName}`,
    sha,
  });

  if (files) {
    const dataToUpload = await Promise.all(
      Object.values(files).map(
        (file) =>
          new Promise<{ file: FFile; buffer: Buffer }>((resolve, reject) =>
            fs.readFile((file as any as FFile).filepath, (err, buffer) => {
              if (err) {
                reject(err);
              } else {
                resolve({ file: file as any as FFile, buffer });
              }
            })
          )
        // .then(({ file, buffer }) => {
        //   console.log(`uploading ${file.originalFilename}`);
        //   return octokit
        //     .request("PUT /repos/{owner}/{repo}/contents/{path}", {
        //       owner: body.owner as string,
        //       repo: body.repository as string,
        //       path: (body.path as string) + "/" + file.originalFilename,
        //       message: `update from Assetier: ${file.originalFilename}`,
        //       content: buffer.toString("base64"),
        //       branch: branchName,
        //     })
        //     .then(() => {
        //       console.log(`uploaded ${file.originalFilename}`);
        //     })
        //     .catch((e) => {
        //       console.log(`failed to upload ${file.originalFilename}\n${e}`);
        //     });
        // })
      )
    );

    for (let { buffer, file } of dataToUpload) {
      await octokit
        .request("PUT /repos/{owner}/{repo}/contents/{path}", {
          owner: body.owner as string,
          repo: body.repository as string,
          path: (body.path as string) + "/" + file.originalFilename,
          message: `update from Assetier: ${file.originalFilename}`,
          content: buffer.toString("base64"),
          branch: branchName,
        })
        .then(() => {
          console.log(`uploaded ${file.originalFilename}`);
        });
    }
  }

  console.log("all files uploaded");

  const pr = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: body.owner as string,
    repo: body.repository as string,
    title: "Assetier update",
    base: "main",
    head: branchName,
  });

  res.status(200).json({ name: "John Doe" });
}
