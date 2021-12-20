import useSWR from "swr";
import type { Project } from "@prisma/client";
import { fetcher } from "@utils/fetcher";

export function useProject(id: string) {
  const { data, error } = useSWR<Project>(`/api/projects/${id}`, fetcher);
  return {
    project: data,
    error,
  };
}
