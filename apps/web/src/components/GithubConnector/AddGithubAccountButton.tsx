import type { FC } from "react";
import { PlusSmIcon } from "@heroicons/react/outline";

import { useAccount } from "@hooks/useAccount";

export interface AddGithubAccountButtonProps {
  mode?: "button" | "option";
}

export const AddGithubAccountButton: FC<AddGithubAccountButtonProps> = ({
  mode,
}) => {
  const { account } = useAccount();
  return (
    <button
      type="button"
      className={
        mode === "option"
          ? "relative w-full cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-zinc-600 hover:text-white"
          : "relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm"
      }
      onClick={() => {
        const state = account.id;
        window.open(
          `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new?state=${state}`,
          "winname",
          "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800,height=600"
        );
      }}
    >
      <div className="flex items-center">
        <PlusSmIcon className="h-5 w-5 flex-shrink-0" />
        <span className="ml-3 block truncate font-normal">
          Add Github Account
        </span>
      </div>
    </button>
  );
};
