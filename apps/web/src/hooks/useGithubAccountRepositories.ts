import useSWR from "swr";
import { fetcher } from "@utils/fetcher";

import { useAccount } from "@hooks/useAccount";

export interface Repository {
  id: number;
  name: string;
  owner: {
    login: string;
  };
  private: boolean;
}

export function useGithubAccountRepositories(installationId?: number) {
  const { account } = useAccount();
  const { data, error } = useSWR<Repository[]>(
    installationId
      ? [
          `/api/accounts/${account.id}/accounts/${installationId}/repositories`,
          account,
          installationId,
        ]
      : [],
    fetcher
  );

  return {
    repositories: data,
    error,
  };
}
