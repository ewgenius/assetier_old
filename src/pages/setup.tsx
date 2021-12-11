import * as fs from "fs";
import * as path from "path";
import type { NextPage, GetServerSideProps } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { App } from "@octokit/app";
import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";

// const app = new App({
//   appId: process.env.GITHUB_APP_ID as string,
//   privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
// });

const AuthBlock = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export const Setup: NextPage<{
  icons: Array<Array<{ name: string; download_url: string; html_url: string }>>;
}> = ({ icons }) => {
  return (
    <div>
      <AuthBlock />

      <div className="mt-8">
        {icons.map((icns) =>
          icns.map((icon) => (
            <div key={icon.name} className="m-2">
              <img className="w-[48px] h-[48px]" src={icon.download_url} />
              <p>{icon.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const privateKey = await new Promise<string>((resolve, reject) => {
    if (!!process.env.GITHUB_APP_PRIVATE_KEY) {
      return resolve(process.env.GITHUB_APP_PRIVATE_KEY);
    }
    fs.readFile(
      path.resolve("./assetier-dev.2021-12-11.private-key-2.pem"),
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.toString());
        }
      }
    );
  });

  // const auth = createAppAuth({
  //   appId: Number(process.env.GITHUB_APP_ID),
  //   privateKey,
  //   clientId: process.env.GITHUB_APP_CLIENT_ID,
  //   clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  // });

  // const appAuthentication = await auth({ type: "app" });

  // console.log(appAuthentication);

  const app = new App({
    appId: Number(process.env.GITHUB_APP_ID),
    privateKey,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
    installationId: Number(context.query.installation_id),
  });

  const icons = [];

  for await (const { octokit, repository } of app.eachRepository.iterator()) {
    const contents = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: repository.owner.login,
        repo: repository.name,
        path: "svg",
      }
    );

    (contents.data as any).forEach((i: any) => console.log(i.download_url));

    icons.push(contents.data);
  }

  // const octokit = new Octokit({
  //   authStrategy: createAppAuth,
  //   auth: {
  //     appId: Number(process.env.GITHUB_APP_ID),
  //     privateKey,
  //     clientId: process.env.GITHUB_APP_CLIENT_ID,
  //     clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  //     installationId: Number(context.query.installation_id),
  //   },
  // });

  // const result = await octokit.request("GET /user");
  // console.log("authenticated as %s", result);

  // const { data: slug } = await app.octokit.rest.apps.getAuthenticated();
  // const octokit = await app.getInstallationOctokit(
  //   Number(context.query.installation_id)
  // );

  // console.log(slug, octokit);

  return {
    props: {
      icons,
    },
  };
};

export default Setup;
