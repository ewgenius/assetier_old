import useSWR, { useSWRConfig } from "swr";
import type { FigmaOauthConnection } from "@assetier/prisma";

import { fetcher } from "@utils/fetcher";
import { useOrganization } from "@hooks/useOrganization";
import { OrganizationWithPlan } from "@assetier/types";
import { useCallback } from "react";

export function useFigmaConnections(org?: OrganizationWithPlan) {
  const { organization } = useOrganization(org);
  const { data, error } = useSWR<FigmaOauthConnection[]>(
    [`/api/organizations/${organization.id}/figma/connections`, organization],
    fetcher
  );

  const { mutate } = useSWRConfig();
  const deleteConnection = useCallback(
    (connection: FigmaOauthConnection) => {
      if (data) {
        const index = data.findIndex((c) => c.id === connection.id);
        if (index !== -1) {
          const newData = [...data?.slice(0, index), ...data?.slice(index + 1)];
          mutate(
            [
              `/api/organizations/${organization.id}/figma/connections`,
              organization,
            ],
            newData,
            false
          );

          fetcher(
            `/api/organizations/${organization.id}/figma/connections/${connection.id}`,
            {
              method: "DELETE",
            }
          ).then(() =>
            mutate(
              [
                `/api/organizations/${organization.id}/figma/connections`,
                organization,
              ],
              newData
            )
          );
        }
      }
    },
    [organization, data]
  );

  return {
    connections: data,
    deleteConnection,
    error,
  };
}
