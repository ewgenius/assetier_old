import type { FC } from "react";
import { PlusSmIcon } from "@heroicons/react/outline";

import { useOrganization } from "@hooks/useOrganization";
import type { OrganizationWithPlan } from "@assetier/types";

export interface ConnectFigmaButton {
  organization?: OrganizationWithPlan;
  mode?: "button" | "option";
}

export const ConnectFigmaButton: FC<ConnectFigmaButton> = ({
  organization: org,
  mode,
}) => {
  const { organization } = useOrganization(org);
  return (
    <button
      type="button"
      className={
        mode === "option"
          ? "relative w-full cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-zinc-600 hover:text-white"
          : "relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm"
      }
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
        <PlusSmIcon className="h-5 w-5 flex-shrink-0" />
        <span className="ml-3 block truncate font-normal">Connect Figma</span>
      </div>
    </button>
  );
};
