import useSWR from "swr";
import type { Project } from "@assetier/prisma";

import { useAccount } from "@hooks/useAccount";
import { fetcher } from "@utils/fetcher";

export function useProjectFigmaFile(project: Project) {
  const { account } = useAccount();
  const { data, error } = useSWR<any[]>(
    [
      `/api/accounts/${account.id}/projects/${project.id}/figma`,
      account,
      project.id,
    ],
    fetcher
  );

  console.log(data);

  return {
    data,
    error,
  };
}
