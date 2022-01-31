import useSWR from "swr";
import type { Project } from "@assetier/prisma";

import { fetcher } from "@utils/fetcher";
import { AccountWithPlan } from "@assetier/types";

export function useAccountProjects(account: AccountWithPlan | null) {
  const { data, error } = useSWR<Project[]>(
    account ? [`/api/account/${account.id}/projects`, account] : [],
    fetcher
  );

  return {
    projects: data,
    error,
  };
}
