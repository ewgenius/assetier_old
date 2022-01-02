import type { FC } from "react";
import { PlusSmIcon } from "@heroicons/react/outline";

import { useOrganization } from "@hooks/useOrganization";

export interface AddGithubAccountButtonProps {
  mode: "button" | "option";
}

export const AddGithubAccountButton: FC<AddGithubAccountButtonProps> = ({
  mode,
}) => {
  const { organization } = useOrganization();
  return (
    <button
      type="button"
      className={
        mode === "option"
          ? "w-full text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:text-white hover:bg-zinc-600"
          : "bg-white cursor-pointer relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
      }
      onClick={() => {
        const state = organization.id;
        window.open(
          `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new?state=${state}`,
          "winname",
          "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800,height=600"
        );
      }}
    >
      <div className="flex items-center">
        <PlusSmIcon className="flex-shrink-0 h-5 w-5" />
        <span className="font-normal ml-3 block truncate">
          Add Github Account
        </span>
      </div>
    </button>
  );
};
