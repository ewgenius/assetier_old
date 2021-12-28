import { SearchIcon } from "@heroicons/react/outline";
import { GithubFile } from "@utils/types";
import { FC } from "react";
import { LayoutBlock } from "./LayoutBlock";
import { Spinner } from "./Spinner";
import { TextInputProps } from "./TextInput";

export interface AssetsGridProps {
  assets?: GithubFile[];
}

export interface AssetsToolbarProps {
  query: string;
  onQueryChange: TextInputProps["onChange"];
  querying: boolean;
  onUploadClick: () => void;
}

export const AssetsToolbar: FC<AssetsToolbarProps> = ({
  query,
  onQueryChange,
  querying,
  onUploadClick,
}) => {
  return (
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
            onChange={onQueryChange}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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

        <button
          type="button"
          className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          onClick={onUploadClick}
        >
          Upload Assets
        </button>
      </div>
    </LayoutBlock>
  );
};
