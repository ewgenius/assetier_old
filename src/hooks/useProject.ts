import useSWR from "swr";
import type { Project } from "@prisma/client";
import { fetcher } from "@utils/fetcher";

export function useProject(organizationId: string, projectId: string) {
  const { data, error } = useSWR<Project>(
    `/api/organizations/${organizationId}/projects/${projectId}`,
    fetcher
  );

  return {
    project: data,
    error,
  };
}
