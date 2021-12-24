import useSWR from "swr";
import type { GithubInstallation, Project } from "@prisma/client";
import { fetcher } from "@utils/fetcher";

export function useGithubAccounts(organizationId: string) {
  const { data, error } = useSWR<GithubInstallation[]>(
    `/api/organizations/${organizationId}/accounts`,
    fetcher
  );

  return {
    accounts: data,
    error,
  };
}
