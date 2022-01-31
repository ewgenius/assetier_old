import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import type { GithubCommit } from "@assetier/types";
import { useAccount } from "@hooks/useAccount";

export function useAssetCommits(projectId: string, path?: string) {
  const { account } = useAccount();
  const { data, error } = useSWR<GithubCommit[]>(
    [
      `/api/accounts/${account.id}/projects/${projectId}/commits?path=${path}`,
      account,
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
