import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@utils/fetcher";
import type { GithubFile } from "@assetier/types";
import { useOrganization } from "@hooks/useOrganization";

export function useProjectContents(projectId: string, branch?: string) {
  const { organization } = useOrganization();
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR<GithubFile[]>(
    [
      `/api/organizations/${organization.id}/projects/${projectId}/contents${
        branch ? `?branch=${branch}` : ""
      }`,
      organization,
      projectId,
      branch,
    ],
    fetcher
  );

  const refresh = () => {
    mutate([
      `/api/organizations/${organization.id}/projects/${projectId}/contents${
        branch ? `?branch=${branch}` : ""
      }`,
      organization,
      projectId,
      branch,
    ]);
  };

  return {
    contents: data,
    refresh,
    error,
  };
}
