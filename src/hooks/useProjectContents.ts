import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import type { GithubFile } from "@utils/types";
import { useOrganization } from "@hooks/useOrganization";

export function useProjectContents(projectId: string) {
  const organization = useOrganization();
  const { data, error } = useSWR<GithubFile[]>(
    [
      `/api/organizations/${organization.id}/projects/${projectId}/contents`,
      organization,
      projectId,
    ],
    fetcher
  );

  return {
    contents: data,
    error,
  };
}
