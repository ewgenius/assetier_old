import type { FC } from "react";
import { PlusSmIcon } from "@heroicons/react/outline";

import { useOrganization } from "@hooks/useOrganization";

export const ConnectFigmaButton: FC = () => {
  const { organization } = useOrganization();
  return (
    <button
      type="button"
      className="bg-white cursor-pointer relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
      onClick={() => {
        const state = organization.id;
        window.open(
          `https://www.figma.com/oauth?client_id=${process.env.NEXT_PUBLIC_FIGMA_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_FIGMA_REDIRECT_URI}&scope=file_read&response_type=code&state=${state}`,
          "winname",
          "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800,height=600"
        );
      }}
    >
      <div className="flex items-center">
        <PlusSmIcon className="flex-shrink-0 h-5 w-5" />
        <span className="font-normal ml-3 block truncate">Connect Figma</span>
      </div>
    </button>
  );
};
