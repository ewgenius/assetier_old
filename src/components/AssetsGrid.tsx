import { SearchCircleIcon, SearchIcon } from "@heroicons/react/outline";
import { useDelayedInputState } from "@hooks/useInputState";
import { useProjectContents } from "@hooks/useProjectContents";
import { Project } from "@prisma/client";
import { FC } from "react";
import { LayoutBlock } from "./LayoutBlock";
import { Spinner } from "./Spinner";
import { TextInput } from "./TextInput";

export interface AssetsGridProps {
  project: Project;
}

export const AssetsGrid: FC<AssetsGridProps> = ({ project }) => {
  const { contents } = useProjectContents(project.id);
  const [query, delayedQuery, setQuery, delaying] = useDelayedInputState();
  return (
    <>
      <LayoutBlock mode="primary" borderBottom sticky>
        <div className="flex">
          <div className="relative flex flex-grow rounded-md">
            <input
              type="text"
              name="account-number"
              id="account-number"
              className="focus:ring-zinc-500 focus:border-zinc-500 block w-full pr-10 sm:text-sm border-gray-300  rounded-md"
              placeholder="Search for an asset..."
              value={query}
              onChange={setQuery}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {delaying ? (
                <Spinner />
              ) : (
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          <button
            type="button"
            className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          >
            Upload Assets
          </button>
        </div>
      </LayoutBlock>
      <LayoutBlock>
        {contents ? (
          <div className="flex flex-col">
            <div className="grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-2">
              {contents
                .filter(
                  (asset) =>
                    asset.download_url && asset.name.includes(delayedQuery)
                )
                .map((asset) => (
                  <div key={asset.name} className="flex">
                    <a
                      className="h-28 flex flex-col flex-grow justify-center items-center p-2 rounded-md bg-white hover:outline outline-offset-2 outline-2 outline-zinc-500"
                      href={asset._links.html}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        className="w-[24px] h-[24px] mb-2"
                        src={asset.download_url}
                      />
                      <p className="font-mono text-xs">{asset.name}</p>
                    </a>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}
      </LayoutBlock>
    </>
  );
};
