import useSWR from "swr";
import type { Project } from "@prisma/client";
import { fetcher } from "@utils/fetcher";
import { useOrganization } from "@hooks/useOrganization";

export function useProject(projectId: string) {
  const organization = useOrganization();
  const { data, error } = useSWR<Project>(
    [
      `/api/organizations/${organization.id}/projects/${projectId}`,
      organization.id,
      projectId,
    ],
    fetcher
  );

  return {
    project: data,
    error,
  };
}
