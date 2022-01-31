import useSWR from "swr";
import type { GithubInstallation } from "@assetier/prisma";

import { fetcher } from "@utils/fetcher";
import { useAccount } from "@hooks/useAccount";

export function useGithubAccounts() {
  const { account } = useAccount();
  const { data, error } = useSWR<GithubInstallation[]>(
    [`/api/accounts/${account.id}/accounts`, account],
    fetcher
  );

  return {
    accounts: data,
    error,
  };
}
