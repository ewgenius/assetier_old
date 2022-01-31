import useSWR from "swr";
import type { Project } from "@assetier/prisma";
import { fetcher } from "@utils/fetcher";
import { useAccount } from "@hooks/useAccount";

export function useProject(projectId: string) {
  const { account } = useAccount();
  const { data, error } = useSWR<Project>(
    [`/api/accounts/${account.id}/projects/${projectId}`, account, projectId],
    fetcher
  );

  return {
    project: data,
    error,
  };
}
