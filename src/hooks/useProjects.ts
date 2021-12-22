import useSWR, { useSWRConfig } from "swr";
import type { Project } from "@prisma/client";
import { fetcher } from "@utils/fetcher";
import { useCallback, useState } from "react";
import { useAppContext } from "./useAppContext";

export function useProjects(organizationId: string) {
  const { data, error } = useSWR<Project[]>(
    `/api/organizations/${organizationId}/projects`,
    fetcher
  );
  const [creating, setCreating] = useState(false);
  const { mutate } = useSWRConfig();

  const createProject = useCallback(
    (project: Partial<Project>) => {
      setCreating(true);
      return mutate(
        `/api/organizations/${organizationId}/projects`,
        fetch(`/api/organizations/${organizationId}/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(project),
        })
          .then((r) => r.json())
          .then((newProject) => [...(data || []), newProject])
          .finally(() => setCreating(false))
      );
    },
    [data]
  );

  return {
    projects: data,
    error,
    createProject,
    creating,
  };
}
