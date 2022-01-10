import useSWR from "swr";
import type { GithubInstallation } from "@assetier/prisma";

import { fetcher } from "@utils/fetcher";
import { useOrganization } from "@hooks/useOrganization";

export function useGithubAccounts() {
  const { organization } = useOrganization();
  const { data, error } = useSWR<GithubInstallation[]>(
    [`/api/organizations/${organization.id}/accounts`, organization],
    fetcher
  );

  return {
    accounts: data,
    error,
  };
}
