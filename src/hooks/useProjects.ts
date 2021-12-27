import useSWR from "swr";
import type { Project } from "@prisma/client";

import { mapFetcher } from "@utils/fetcher";
import { useOrganization } from "@hooks/useOrganization";

export function useProjects() {
  const organization = useOrganization();
  const { data, error } = useSWR<Record<string, Project>>(
    [`/api/organizations/${organization.id}/projects`, organization],
    mapFetcher<Project>((project) => project.id)
  );

  return {
    projects: data,
    error,
  };
}
