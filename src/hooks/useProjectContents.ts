import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import type { GithubFile } from "@utils/types";

export function useProjectContents(organizationId: string, projectId: string) {
  const { data, error } = useSWR<GithubFile>(
    `/api/organizations/${organizationId}/projects/${projectId}/contents`,
    fetcher
  );

  return {
    contents: data,
    error,
  };
}
