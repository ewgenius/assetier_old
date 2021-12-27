import useSWR from "swr";
import type { Project } from "@prisma/client";
import { fetcher } from "@utils/fetcher";

export function useProjects(organizationId: string) {
  const { data, error } = useSWR<Project[]>(
    `/api/organizations/${organizationId}/projects`,
    fetcher
  );

  return {
    projects: data,
    error,
  };
}
