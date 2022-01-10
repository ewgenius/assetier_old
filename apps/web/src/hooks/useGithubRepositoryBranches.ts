import useSWR from "swr";
import type { Project } from "lib-prisma";
import type { GithubBranch } from "@assetier/types";

import { useOrganization } from "@hooks/useOrganization";
import { fetcher } from "@utils/fetcher";

export function useGithubRepositoryBranches(
  installationId?: number,
  owner?: string,
  repository?: string
) {
  const { organization } = useOrganization();
  const { data, error } = useSWR<GithubBranch[]>(
    installationId && owner && repository
      ? [
          `/api/organizations/${organization.id}/accounts/${installationId}/${owner}/${repository}/branches`,
          organization,
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
