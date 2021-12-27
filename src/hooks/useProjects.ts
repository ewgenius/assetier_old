import useSWR from "swr";
import type { Project } from "@prisma/client";
import { fetcher } from "@utils/fetcher";
import { useOrganization } from "./useOrganization";

export function useProjects() {
  const organization = useOrganization();
  const { data, error } = useSWR<Project[]>(
    [`/api/organizations/${organization.id}/projects`, organization],
    fetcher
  );

  return {
    projects: data,
    error,
  };
}
