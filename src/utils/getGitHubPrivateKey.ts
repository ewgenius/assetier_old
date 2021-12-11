import * as fs from "fs";
import * as path from "path";

// test
export function getGitHubPrivateKey() {
  return new Promise<string>((resolve, reject) => {
    if (!!process.env.GITHUB_APP_PRIVATE_KEY) {
      return resolve(process.env.GITHUB_APP_PRIVATE_KEY);
    }
    fs.readFile(
      path.resolve(".temp/github-app-private-key.pem"),
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.toString());
        }
      }
    );
  });
}
