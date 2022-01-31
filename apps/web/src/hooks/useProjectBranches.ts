import useSWR from "swr";
import type { Project } from "@assetier/prisma";
import type { GithubBranch } from "@assetier/types";

import { useAccount } from "@hooks/useAccount";
import { fetcher } from "@utils/fetcher";

export function useProjectBranches(project: Project) {
  const { account } = useAccount();
  const { data, error } = useSWR<GithubBranch[]>(
    [
      `/api/accounts/${account.id}/projects/${project.id}/branches`,
      account,
      project.id,
    ],
    fetcher
  );

  return {
    branches: data,
    error,
  };
}
