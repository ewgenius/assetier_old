import useSWR from "swr";
import { fetcher } from "@utils/fetcher";

export interface Repository {
  id: number;
  name: string;
  owner: {
    login: string;
  };
}

export function useGithubAccountRepositories(
  organizationId: string,
  installationId: number
) {
  const { data, error } = useSWR<Repository[]>(
    `/api/organizations/${organizationId}/accounts/${installationId}/repositories`,
    fetcher
  );

  return {
    repositories: data,
    error,
  };
}
