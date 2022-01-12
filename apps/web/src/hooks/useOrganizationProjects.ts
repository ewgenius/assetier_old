import useSWR from "swr";
import type { Project } from "@assetier/prisma";

import { fetcher } from "@utils/fetcher";
import { OrganizationWithPlan } from "@assetier/types";

export function useOrganizationProjects(
  organization: OrganizationWithPlan | null
) {
  const { data, error } = useSWR<Project[]>(
    organization
      ? [`/api/organizations/${organization.id}/projects`, organization]
      : [],
    fetcher
  );

  return {
    projects: data,
    error,
  };
}
