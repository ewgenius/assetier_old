import { useCallback, useState } from "react";
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

export const NewFile = () => {
  const { query } = useRouter();

  const [name, setName] = useState<string>("new_icon.svg");
  const [content, setContent] = useState<string>(`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
  <polygon points="12 15 17 21 7 21 12 15" />
</svg>`);

  const upload = useCallback(() => {
    fetch(`/api/github/upload?installation_id=${query.installation_id}`, {
      method: "POST",
      body: JSON.stringify({
        owner: query.owner,
        repository: query.repository,
        path: query.path + "/" + name,
        content,
      }),
    });
  }, [name, content, query.owner, query.repo, query.path]);

  return (
    <div className="my-2 flex flex-col">
      <p>Add new file</p>

      <input
        className="border border-gray-800 rounded-md mb-1"
        value={name}
        onChange={({ target: { value } }) => setName(value)}
      />
      <textarea
        className="border border-gray-800 rounded-md min-h-[180px] text-xs font-mono"
        value={content}
        onChange={({ target: { value } }) => setContent(value)}
      />
      <button onClick={upload}>upload</button>
    </div>
  );
};

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

        <NewFile />

        <p>Available icons under /{query.path}:</p>
        {!icons ||
          (!icons.length && <div className="mt-2">Nothing found...</div>)}
        <div className="grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-1">
          {icons.map(
            (icon) =>
              icon.download_url && (
                <div key={icon.name} className="m-2">
                  <a
                    className="flex flex-col align-middle items-center"
                    href={icon._links.html}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      className="w-[24px] h-[24px] mr-4"
                      src={icon.download_url}
                    />
                    <p className="font-mono text-xs">{icon.name}</p>
                  </a>
                </div>
              )
          )}
        </div>
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
