import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import type { GithubCommit } from "@utils/types";
import { useOrganization } from "@hooks/useOrganization";

export function useAssetCommits(projectId: string, path?: string) {
  const { organization } = useOrganization();
  const { data, error } = useSWR<GithubCommit[]>(
    [
      `/api/organizations/${organization.id}/projects/${projectId}/commits?path=${path}`,
      organization,
      projectId,
      path,
    ],
    fetcher
  );

  return {
    commits: data,
    error,
  };
}
