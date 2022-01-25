import type { FC } from "react";
import type { FigmaOauthConnection } from "@assetier/prisma";

import { classNames } from "@utils/classNames";
import { Select } from "@components/Select";
import { ConnectFigmaButton } from "./ConnectFigmaButton";
import type { OrganizationWithPlan } from "@assetier/types";

export interface FigmaConnectionSelectorProps {
  organization?: OrganizationWithPlan;
  selectedConnection: FigmaOauthConnection | null;
  onChange: (connection: FigmaOauthConnection | null) => void;
  connections?: FigmaOauthConnection[];
  defaultConnectionId?: string;
  disabled?: boolean;
  onDelete?: (connection: FigmaOauthConnection) => void;
}

export const FigmaConnectionSelector: FC<FigmaConnectionSelectorProps> = ({
  organization,
  onChange,
  selectedConnection,
  connections,
  defaultConnectionId,
  disabled,
  onDelete,
}) => {
  return (
    <>
      {connections && connections.length === 0 ? (
        <>
          <div className="mb-1 block text-sm font-medium text-gray-700">
            Figma Connection
          </div>
          <ConnectFigmaButton mode="button" organization={organization} />
        </>
      ) : (
        <>
          <Select
            label="Figma Connection"
            placeholder="Select Figma account"
            disabled={disabled}
            selectedItem={selectedConnection}
            items={connections}
            onChange={onChange}
            onDelete={onDelete}
            renderButton={(connection: FigmaOauthConnection) => (
              <span className="flex items-center">
                <img
                  src={connection.userImage}
                  alt=""
                  className="h-5 w-5 flex-shrink-0 rounded-full border border-zinc-200 bg-white"
                />
                <div className="ml-3 flex-grow">
                  <span className="block truncate">
                    {connection.userHandle}
                  </span>
                  <span className="block truncate text-xs">
                    {connection.createdAt}
                  </span>
                </div>
              </span>
            )}
            renderBefore={() => (
              <li>
                <ConnectFigmaButton mode="option" organization={organization} />
                <div className="w-full px-2 py-1">
                  <div className="border-b border-gray-100" />
                </div>
              </li>
            )}
            preselectedId={defaultConnectionId}
            getItemId={(connection: FigmaOauthConnection) => connection.id}
            renderItem={(connection: FigmaOauthConnection, { selected }) => (
              <div className="flex items-center">
                <img
                  src={connection.userImage}
                  alt=""
                  className="h-5 w-5 flex-shrink-0 rounded-full border border-zinc-200"
                />
                <div className="ml-3 flex-grow">
                  <span
                    className={classNames(
                      selected ? "font-semibold" : "font-normal",
                      "block flex-grow truncate"
                    )}
                  >
                    {connection.userHandle}
                  </span>
                  <span className="block truncate text-xs">
                    {connection.createdAt}
                  </span>
                </div>
              </div>
            )}
          />
        </>
      )}
    </>
  );
};
