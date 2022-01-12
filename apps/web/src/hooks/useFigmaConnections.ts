import useSWR from "swr";
import type { FigmaOauthConnection } from "@assetier/prisma";

import { fetcher } from "@utils/fetcher";
import { useOrganization } from "@hooks/useOrganization";
import { OrganizationWithPlan } from "@assetier/types";

export function useFigmaConnections(org?: OrganizationWithPlan) {
  const { organization } = useOrganization(org);
  const { data, error } = useSWR<FigmaOauthConnection[]>(
    [`/api/organizations/${organization.id}/figma/connections`, organization],
    fetcher
  );

  return {
    connections: data,
    error,
  };
}
