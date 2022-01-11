import type { FC } from "react";
import type { FigmaOauthConnection } from "@assetier/prisma";

import { classNames } from "@utils/classNames";
import { Select } from "@components/Select";
import { ConnectFigmaButton } from "./ConnectFigmaButton";

export interface FigmaConnectionSelectorProps {
  selectedConnection: FigmaOauthConnection | null;
  onChange: (connection: FigmaOauthConnection | null) => void;
  connections?: FigmaOauthConnection[];
  defaultConnectionId?: string;
  disabled?: boolean;
}

export const FigmaConnectionSelector: FC<FigmaConnectionSelectorProps> = ({
  onChange,
  selectedConnection,
  connections,
  defaultConnectionId,
  disabled,
}) => {
  return (
    <>
      {connections && connections.length === 0 ? (
        <>
          <div className="block mb-1 text-sm font-medium text-gray-700">
            Figma Connection
          </div>
          <ConnectFigmaButton mode="button" />
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
            renderButton={(connection: FigmaOauthConnection) => (
              <span className="flex items-center">
                <img
                  src={connection.userImage}
                  alt=""
                  className="flex-shrink-0 h-5 w-5 border border-zinc-200 bg-white rounded-full"
                />
                <span className="ml-3 block truncate">
                  {connection.userHandle}
                </span>
              </span>
            )}
            renderBefore={() => (
              <li>
                <ConnectFigmaButton mode="option" />
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
                  className="flex-shrink-0 h-5 w-5 border border-zinc-200 rounded-full"
                />
                <span
                  className={classNames(
                    selected ? "font-semibold" : "font-normal",
                    "ml-3 block truncate flex-grow"
                  )}
                >
                  {connection.userHandle}
                </span>
              </div>
            )}
          />
        </>
      )}
    </>
  );
};
