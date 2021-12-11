import type { NextPage, GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { App } from "@octokit/app";
import { AuthBlock } from "@components/AuthBlock";
import { getGitHubPrivateKey } from "@utils/getGitHubPrivateKey";

export interface SetupProps {
  icons: {
    name: string | null;
    download_url: string | null;
    git_url: string;
    _links: {
      html: string;
    };
  }[];
}

export const Setup: NextPage<SetupProps> = ({ icons }) => {
  const { query } = useRouter();
  return (
    <div className="container mx-auto p-2">
      <AuthBlock />

      <div className="mt-8">
        <Link href={`/setup?installation_id=${query.installation_id}`}>
          <a className="underline hover:no-underline">Back to repo list</a>
        </Link>

        <div className="mt-2">
          Repo:{" "}
          <b>
            {query.owner}/{query.repository}
          </b>
        </div>
        <p>Available icons under /svg:</p>
        {!icons ||
          (!icons.length && <div className="mt-2">Nothing found...</div>)}
        {icons.map(
          (icon) =>
            icon.download_url && (
              <div key={icon.name} className="m-2">
                <a
                  className="flex flex-row align-middle items-center"
                  href={icon._links.html}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="w-[24px] h-[24px] mr-4"
                    src={icon.download_url}
                  />
                  <p className="font-mono text-sm">{icon.name}</p>
                </a>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<SetupProps> = async (
  context
) => {
  const privateKey = await getGitHubPrivateKey();

  const app = new App({
    appId: Number(process.env.GITHUB_APP_ID),
    privateKey,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  const octokit = await app.getInstallationOctokit(
    Number(context.query.installation_id)
  );

  try {
    const contents = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: context.query.owner as string,
        repo: context.query.repository as string,
        path: "svg",
      }
    );

    const icons = contents.data as any[];

    return {
      props: {
        icons,
      },
    };
  } catch (e) {
    return {
      props: {
        icons: [],
      },
    };
  }
};

export default Setup;
