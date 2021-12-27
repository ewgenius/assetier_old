import useSWR from "swr";
import { fetcher } from "@utils/fetcher";

import { useOrganization } from "@hooks/useOrganization";

export interface Repository {
  id: number;
  name: string;
  owner: {
    login: string;
  };
}

export function useGithubAccountRepositories(installationId: number) {
  const organization = useOrganization();
  const { data, error } = useSWR<Repository[]>(
    [
      `/api/organizations/${organization.id}/accounts/${installationId}/repositories`,
      organization,
      installationId,
    ],
    fetcher
  );

  return {
    repositories: data,
    error,
  };
}
