import { useState } from "react";
import type { FC } from "react";
import type { FigmaOauthConnection } from "@assetier/prisma";
import { classNames } from "@utils/classNames";
import { FigmaConnectionSelector } from "@components/FigmaConnectionSelector";
import { useFigmaConnections } from "@hooks/useFigmaConnections";
import { OrganizationWithPlan } from "@assetier/types";

export interface FigmaConnectorProps {
  organization?: OrganizationWithPlan;
  connectionId?: string;
  layout?: "column" | "row";
  disabled?: boolean;
  onChange?: (connectionId: string | null | undefined) => void;
}

export const FigmaConnector: FC<FigmaConnectorProps> = ({
  organization,
  connectionId,
  layout,
  disabled,
  onChange,
}) => {
  const { connections } = useFigmaConnections(organization);
  const [selectedConnection, setSelectedConnection] =
    useState<FigmaOauthConnection | null>(null);

  const selectConnection = (connection: FigmaOauthConnection | null) => {
    setSelectedConnection(connection);
    onChange && onChange(connection?.id);
  };

  return (
    <div
      className={classNames(
        "flex",
        layout === "column" && "flex-col space-y-4",
        layout === "row" && "flex-row sm:space-x-2 md:space-x-4",
        !layout &&
          "flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2 md:space-x-4"
      )}
    >
      <div
        className={classNames(
          layout === "row" && "flex-1 flex-shrink-0",
          !layout && "sm:flex-1 sm:flex-shrink-0"
        )}
      >
        <FigmaConnectionSelector
          disabled={disabled}
          selectedConnection={selectedConnection}
          connections={connections}
          onChange={selectConnection}
          defaultConnectionId={connectionId}
        />
      </div>
    </div>
  );
};
