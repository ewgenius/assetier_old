import useSWR from "swr";
import type { FigmaOauthConnection } from "@prisma/client";

import { fetcher } from "@utils/fetcher";
import { useOrganization } from "@hooks/useOrganization";

export function useFigmaConnections() {
  const { organization } = useOrganization();
  const { data, error } = useSWR<FigmaOauthConnection[]>(
    [`/api/organizations/${organization.id}/figma/connections`, organization],
    fetcher
  );

  return {
    connections: data,
    error,
  };
}
