import useSWR from "swr";
import type { Project } from "@prisma/client";

import { useOrganization } from "@hooks/useOrganization";
import { fetcher } from "@utils/fetcher";

export function useProjectFigmaFile(project: Project) {
  const { organization } = useOrganization();
  const { data, error } = useSWR<any[]>(
    [
      `/api/organizations/${organization.id}/projects/${project.id}/figma`,
      organization,
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
