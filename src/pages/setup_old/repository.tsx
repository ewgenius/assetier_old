import { useCallback, useMemo, useState } from "react";
import type { NextPage, GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { App } from "@octokit/app";
import { AuthBlock } from "@components/AuthBlock";
import { getGitHubPrivateKey } from "@utils/getGitHubPrivateKey";
import { FolderIcon, SearchIcon, UploadIcon } from "@heroicons/react/outline";
import { getOctokit } from "@utils/getOctokit";
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

export const PathInput = () => {
  const { query } = useRouter();

  const [path, setPath] = useState<string>(query.path as string);

  return (
    <div className="my-2">
      <label htmlFor="path" className="block text-sm font-medium text-gray-700">
        Search candidates
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FolderIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="path"
            id="path"
            className="focus:ring-zinc-500 focus:border-zinc-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border border-gray-300"
            placeholder="path to folder with svg files"
            value={path}
            onChange={({ target }) => setPath(target.value)}
          />
        </div>
        <Link
          href={`/setup/repository?installation_id=${query.installation_id}&owner=${query.owner}&repository=${query.repository}&path=${path}`}
        >
          <a className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export const Upload = () => {
  const { query } = useRouter();

  const [files, setFiles] = useState<File[]>([]);

  const upload = useCallback(() => {
    const data = new FormData();
    files.forEach((file) => {
      data.set(file.name, file);
    });

    data.set("owner", query.owner as string);
    data.set("repository", query.repository as string);
    data.set("path", query.path as string);

    fetch(`/api/github/upload?installation_id=${query.installation_id}`, {
      method: "POST",
      body: data,
      // JSON.stringify({
      //   owner: query.owner,
      //   repository: query.repository,
      //   path: query.path + "/" + name,
      // }),
    }).then(() => {
      setFiles([]);
    });
  }, [files]);

  return (
    <label className="my-2 cursor-pointer">
      <div
        // htmlFor="files"
        className="block text-sm font-medium text-gray-700"
      >
        Upload
      </div>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <div className="focus:ring-zinc-500 focus:border-zinc-500 w-full rounded-none rounded-l-md pl-2 pt-2 text-gray-500 sm:text-sm border border-gray-300 flex flex-row">
            {files && files.length > 0
              ? files.map((file) => (
                  <img
                    key={file.name}
                    className="w-5 h-5 mr-1"
                    src={URL.createObjectURL(file)}
                  />
                ))
              : "Upload files..."}
          </div>
          <input
            multiple
            type="file"
            name="files"
            id="files"
            className="hidden"
            placeholder="path to folder with svg files"
            onChange={({ target }) => setFiles(Array.from(target.files || []))}
          />
        </div>

        <button
          onClick={upload}
          className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500"
        >
          <UploadIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </label>
  );
};

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
    }).then(() => {
      location.reload();
    });
  }, [
    name,
    content,
    query.owner,
    query.repository,
    query.path,
    query.installation_id,
  ]);

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

  return (
    <div className="container mx-auto p-2">
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

        <PathInput />

        <Upload />

        {/* <NewFile /> */}

        {!icons ||
          (!icons.length && <div className="mt-2">Nothing found...</div>)}
        <div className="mt-4 grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-1">
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
                      className="w-[24px] h-[24px] mb-1"
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
  const octokit = await getOctokit(Number(context.query.installation_id));

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
