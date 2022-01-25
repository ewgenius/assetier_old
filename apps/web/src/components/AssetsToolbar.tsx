import type { FC } from "react";
import { SearchIcon } from "@heroicons/react/outline";
import type { Project } from "@assetier/prisma";
import type { GithubBranch } from "@assetier/types";
import { GithubBranchSelector } from "./GithubConnector/GithubBranchSelector";
import { LayoutBlock } from "./LayoutBlock";
import { Spinner } from "./Spinner";
import type { TextInputProps } from "./TextInput";

export interface AssetsToolbarProps {
  project: Project;
  query: string;
  onQueryChange: TextInputProps["onChange"];
  querying: boolean;
  onUploadClick: () => void;
  branches?: GithubBranch[];
  selectedBranch: GithubBranch | null;
  onSelectBranch: (branch: GithubBranch | null) => void;
}

export const AssetsToolbar: FC<AssetsToolbarProps> = ({
  project,
  query,
  onQueryChange,
  querying,
  onUploadClick,
  branches,
  selectedBranch,
  onSelectBranch,
}) => {
  return (
    <LayoutBlock mode="primary" borderBottom sticky>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex flex-grow rounded-md">
          <input
            type="text"
            name="account-number"
            id="account-number"
            className="block w-full rounded-md border-gray-300 pr-10 focus:border-zinc-500 focus:ring-zinc-500  sm:text-sm"
            placeholder="Search for an asset..."
            value={query}
            onChange={onQueryChange}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {querying ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : (
              <SearchIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        <div className="sm:w-[280px]">
          <GithubBranchSelector
            label={false}
            branches={branches}
            selectedBranch={selectedBranch}
            defaultBranchName={project.defaultBranch}
            onChange={onSelectBranch}
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
          onClick={onUploadClick}
        >
          Upload
        </button>
      </div>
    </LayoutBlock>
  );
};
