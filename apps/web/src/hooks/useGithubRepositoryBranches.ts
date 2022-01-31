import useSWR from "swr";
import type { Project } from "@assetier/prisma";
import type { GithubBranch } from "@assetier/types";

import { useAccount } from "@hooks/useAccount";
import { fetcher } from "@utils/fetcher";

export function useGithubRepositoryBranches(
  installationId?: number,
  owner?: string,
  repository?: string
) {
  const { account } = useAccount();
  const { data, error } = useSWR<GithubBranch[]>(
    installationId && owner && repository
      ? [
          `/api/accounts/${account.id}/accounts/${installationId}/${owner}/${repository}/branches`,
          account,
          installationId,
          owner,
          repository,
        ]
      : null,
    fetcher
  );

  return {
    branches: data,
    error,
  };
}
