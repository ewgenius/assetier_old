import * as fs from "fs";
import * as crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import formidable, { Files, File as FFile, Fields } from "formidable";
import type { Project } from "@prisma/client";
import type { Octokit } from "@octokit/core";

import { prisma } from "@utils/prisma";
import { getOctokit } from "@utils/getOctokit";
import { withProject } from "@utils/withProject";
import {
  BadRequestError,
  NotAllowedError,
  NotFoundError,
} from "@utils/httpErrors";
import { NextApiRequest } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getProjectInstallation(project: Project) {
  const installation = await prisma.githubInstallation.findUnique({
    where: {
      id: project.githubInstallationId,
    },
  });

  if (!installation) {
    throw new NotFoundError("GH Installation not found");
  }

  return installation;
}

export interface Repository {
  owner: {
    login: string;
  };
  name: string;
}

async function getProjectRepository(project: Project, octokit: Octokit) {
  const repository = await octokit.request("GET /repositories/{id}", {
    id: project.repositoryId,
  });

  if (!repository) {
    throw new NotFoundError("GH Repository not found");
  }

  return repository.data as Repository;
}

async function parseForm(req: NextApiRequest) {
  const form = formidable({});
  return new Promise<{ files: Files; fields: Fields }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({
        files,
        fields,
      });
    });
  });
}

async function getRepositoryBranches(repository: Repository, octokit: Octokit) {
  const branches = await octokit.request("GET /repos/{owner}/{repo}/branches", {
    owner: repository.owner.login as string,
    repo: repository.name as string,
  });

  return branches.data;
}

async function createBranch(
  repository: Repository,
  baseBranchSha: string,
  branchName: string,
  octokit: Octokit
) {
  return octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner: repository.owner.login as string,
    repo: repository.name as string,
    ref: `refs/heads/${branchName}`,
    sha: baseBranchSha,
  });
}

async function prepareFiles(files: formidable.Files) {
  return Promise.all(
    Object.values(files).map(
      (file) =>
        new Promise<{ file: FFile; buffer: Buffer; fileSha: string }>(
          (resolve, reject) =>
            fs.readFile((file as any as FFile).filepath, (err, buffer) => {
              if (err) {
                reject(err);
              } else {
                const hashSum = crypto.createHash("sha1");
                hashSum.update(
                  "blob " + Buffer.byteLength(buffer) + "\0" + buffer
                );
                const fileSha = hashSum.digest("hex");
                resolve({
                  file: file as any as FFile,
                  buffer,
                  fileSha,
                });
              }
            })
        )
    )
  );
}

async function uloadFile(
  project: Project,
  repository: Repository,
  branchName: string,
  file: FFile,
  buffer: Buffer,
  fileSha: string,
  octokit: Octokit
) {
  return octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: repository.owner.login as string,
    repo: repository.name as string,
    path: project.assetsPath + "/" + file.originalFilename,
    message: `update from Assetier: ${file.originalFilename}`,
    content: buffer.toString("base64"),
    branch: branchName,
    sha: fileSha,
  });
}

async function createPullRequest(
  repository: Repository,
  baseBranchName: string,
  branchName: string,
  octokit: Octokit
) {
  const pr = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: repository.owner.login as string,
    repo: repository.name as string,
    title: "Assetier update",
    base: baseBranchName,
    head: branchName,
  });

  return pr.data;
}

async function mergePullRequest(
  repository: Repository,
  pullNumber: number,
  octokit: Octokit
) {
  return octokit.request(
    "PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      pull_number: pullNumber,
    }
  );
}

export default withProject<any>(async (req, res) => {
  const { method, project } = req;
  switch (method) {
    case "POST": {
      const installation = await getProjectInstallation(project);
      const octokit = await getOctokit(installation.installationId);
      const repository = await getProjectRepository(project, octokit);
      const { files, fields } = await parseForm(req);

      const baseBranchName = (fields.baseBranch as string) || "main";
      const merge = fields.merge === "true";

      const branches = await getRepositoryBranches(repository, octokit);
      const branch = branches.find((b) => b.name === baseBranchName);

      if (!branch) {
        throw new BadRequestError(`Branch ${baseBranchName} does not exist`);
      }

      if (!files) {
        throw new BadRequestError("No files uploaded");
      }

      const branchName = `assetier/upload/${uuidv4()}`;
      await createBranch(repository, branch.commit.sha, branchName, octokit);

      const dataToUpload = await prepareFiles(files);

      for (let { buffer, file, fileSha } of dataToUpload) {
        await uloadFile(
          project,
          repository,
          branchName,
          file,
          buffer,
          fileSha,
          octokit
        ).then(() => {
          console.log(`uploaded ${file.originalFilename}`);
        });
      }

      const pr = await createPullRequest(
        repository,
        baseBranchName,
        branchName,
        octokit
      );

      if (merge) {
        await mergePullRequest(repository, pr.number, octokit);
      }

      return res.status(200).json({});
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
