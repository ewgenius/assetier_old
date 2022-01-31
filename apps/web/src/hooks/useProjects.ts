import useSWR, { mutate } from "swr";
import type { Project } from "@assetier/prisma";

import { mapFetcher } from "@utils/fetcher";
import { useAccount } from "@hooks/useAccount";

export function useProjects() {
  const { account } = useAccount();
  const { data, error } = useSWR<Record<string, Project>>(
    [`/api/accounts/${account.id}/projects`, account],
    mapFetcher<Project>((project) => {
      mutate(
        [
          `/api/accounts/${account.id}/projects/${project.id}`,
          account,
          project.id,
        ],
        project
      );
      return project.id;
    })
  );

  return {
    projects: data,
    error,
  };
}
