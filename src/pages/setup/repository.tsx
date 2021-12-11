import { useState } from "react";
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

  const [path, setPath] = useState<string>(query.path as string);

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

        <div className="my-2 flex flex-row">
          <input
            type="string"
            name="path"
            id="path"
            className="block sm:text-sm border-gray-800 border rounded-md rounded-r-none p-2"
            placeholder="path to folder with svg files"
            value={path}
            onChange={({ target }) => setPath(target.value)}
          />
          <Link
            href={`/setup/repository?installation_id=${query.installation_id}&owner=${query.owner}&repository=${query.repository}&path=${path}`}
          >
            <a className="flex p-2 border-gray-800 border rounded-md border-l-0 rounded-l-none hover:bg-gray-200">
              use path
            </a>
          </Link>
        </div>

        <p>Available icons under /{query.path}:</p>
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
        path: context.query.path as string,
      }
    );

    const icons = contents.data as any[];

    return {
      props: {
        icons,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        icons: [],
      },
    };
  }
};

export default Setup;
