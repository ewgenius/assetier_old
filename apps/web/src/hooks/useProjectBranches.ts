import useSWR from "swr";
import type { Project } from "@assetier/prisma";
import type { GithubBranch } from "@utils/types";

import { useOrganization } from "@hooks/useOrganization";
import { fetcher } from "@utils/fetcher";

export function useProjectBranches(project: Project) {
  const { organization } = useOrganization();
  const { data, error } = useSWR<GithubBranch[]>(
    [
      `/api/organizations/${organization.id}/projects/${project.id}/branches`,
      organization,
      project.id,
    ],
    fetcher
  );

  return {
    branches: data,
    error,
  };
}
