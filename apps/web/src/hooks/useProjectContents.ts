import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@utils/fetcher";
import type { GithubFile } from "@assetier/types";
import { useAccount } from "@hooks/useAccount";

export function useProjectContents(projectId: string, branch?: string) {
  const { account } = useAccount();
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR<GithubFile[]>(
    [
      `/api/accounts/${account.id}/projects/${projectId}/contents${
        branch ? `?branch=${branch}` : ""
      }`,
      account,
      projectId,
      branch,
    ],
    fetcher
  );

  const refresh = () => {
    mutate([
      `/api/accounts/${account.id}/projects/${projectId}/contents${
        branch ? `?branch=${branch}` : ""
      }`,
      account,
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
