import type { NextPage, GetServerSideProps } from "next";
import { App } from "@octokit/app";
import { AuthBlock } from "@components/AuthBlock";
import { getGitHubPrivateKey } from "@utils/getGitHubPrivateKey";

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
  const privateKey = await getGitHubPrivateKey();

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

  return {
    props: {
      icons,
    },
  };
};

export default Setup;
