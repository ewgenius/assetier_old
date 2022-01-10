import * as fs from "fs";
import * as crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import type { Files, Fields } from "formidable";
import formidable from "formidable";
import type { NextApiRequest } from "next";
import type { Project } from "@prisma/client";
import type { Octokit } from "@octokit/core";

import { getOctokit } from "@utils/getOctokit";
import { withProject } from "@utils/withProject";
import { BadRequestError, NotAllowedError } from "@utils/httpErrors";
import { getProjectInstallation } from "@utils/getProjectInstallation";
import type { Repository, GHTree } from "@utils/types";
import { getProjectRepository } from "@utils/getProjectRepository";
import { getRepositoryBranches } from "@utils/getRepositoryBranches";
import { createPullRequest } from "@utils/createPullRequest";
import { mergePullRequest } from "@utils/mergePullRequest";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

async function createBranch(
  repository: Repository,
  baseBranchSha: string,
  branchName: string,
  octokit: Octokit
) {
  const branch = await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner: repository.owner.login as string,
    repo: repository.name as string,
    ref: `refs/heads/${branchName}`,
    sha: baseBranchSha,
  });

  return branch.data;
}

export interface FileForUpload {
  file: formidable.File;
  buffer: Buffer;
  fileSha: string;
}

async function prepareFiles(files: formidable.Files): Promise<FileForUpload[]> {
  return Promise.all(
    Object.values(files).map(
      (file) =>
        new Promise<{ file: formidable.File; buffer: Buffer; fileSha: string }>(
          (resolve, reject) =>
            fs.readFile(
              (file as unknown as formidable.File).filepath,
              (err, buffer) => {
                if (err) {
                  reject(err);
                } else {
                  const hashSum = crypto.createHash("sha1");
                  hashSum.update(
                    "blob " + Buffer.byteLength(buffer) + "\0" + buffer
                  );
                  const fileSha = hashSum.digest("hex");
                  resolve({
                    file: file as unknown as formidable.File,
                    buffer,
                    fileSha,
                  });
                }
              }
            )
        )
    )
  );
}

async function uploadFiles(
  project: Project,
  repository: Repository,
  files: FileForUpload[],
  branchName: string,
  branchSha: string,
  octokit: Octokit
) {
  const treeForUpload = files.map<GHTree>(({ file, buffer }) => ({
    path: project.assetsPath + "/" + file.originalFilename,
    mode: "100644",
    type: "blob",
    content: buffer.toString(),
  }));

  const baseCommit = await octokit.request(
    "GET /repos/{owner}/{repo}/git/commits/{commit_sha}",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      commit_sha: branchSha,
    }
  );

  const tree = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
    owner: repository.owner.login as string,
    repo: repository.name as string,
    tree: treeForUpload,
    base_tree: baseCommit.data.tree.sha,
  });

  const commit = await octokit.request(
    "POST /repos/{owner}/{repo}/git/commits",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      message: "update from Assetier",
      tree: tree.data.sha,
      parents: [branchSha],
    }
  );

  const updatedBranch = await octokit.request(
    "PATCH /repos/{owner}/{repo}/git/refs/{ref}",
    {
      owner: repository.owner.login as string,
      repo: repository.name as string,
      ref: `heads/${branchName}`,
      sha: commit.data.sha,
    }
  );

  return updatedBranch.data;
}

export default withProject(async (req, res) => {
  const { method, project } = req;
  switch (method) {
    case "POST": {
      const installation = await getProjectInstallation(project);
      const octokit = await getOctokit(installation.installationId);
      const repository = await getProjectRepository(project, octokit);
      const { files, fields } = await parseForm(req);
      if (!files) {
        throw new BadRequestError("No files uploaded");
      }

      const baseBranchName =
        (fields.baseBranch as string) || project.defaultBranch || "main";
      const merge = fields.merge === "true";

      const branches = await getRepositoryBranches(repository, octokit);
      const baseBranch = branches.find((b) => b.name === baseBranchName);
      console.log(baseBranchName, baseBranch);
      if (!baseBranch) {
        throw new BadRequestError(`Branch ${baseBranchName} does not exist`);
      }

      const branchName = `assetier/upload/${uuidv4()}`;
      const newBranch = await createBranch(
        repository,
        baseBranch.commit.sha,
        branchName,
        octokit
      );

      const dataToUpload = await prepareFiles(files);

      await uploadFiles(
        project,
        repository,
        dataToUpload,
        branchName,
        newBranch.object.sha,
        octokit
      );

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
