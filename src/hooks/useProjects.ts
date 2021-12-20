import useSWR from "swr";
import type { Project } from "@prisma/client";
import { fetcher } from "@utils/fetcher";

export function useProjects() {
  const { data, error } = useSWR<Project[]>("/api/projects", fetcher);
  return {
    projects: data,
    error,
  };
}
