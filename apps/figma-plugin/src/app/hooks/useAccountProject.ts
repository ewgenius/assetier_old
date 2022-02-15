import useSWR from "swr";
import { useAppContext } from "../AppContext";
import { authFetcher } from "../utils/fetcher";
import type { Account, Project } from "@assetier/types";

export function useAccountProject(accountId?: string, projectId?: string) {
  const { accessToken } = useAppContext();
  const { data, error } = useSWR<{
    account: Account;
    project: Project;
  }>(
    [
      accountId &&
        projectId &&
        `${process.env.API_URL}/api/figma/plugin/accounts/${accountId}/projects/${projectId}`,
      accountId,
      projectId,
    ],

    authFetcher(accessToken as string)
  );
  return {
    account: data?.account,
    project: data?.project,
    error,
  };
}
