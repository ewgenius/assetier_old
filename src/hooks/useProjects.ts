import useSWR, { useSWRConfig } from "swr";
import type { Project } from "@prisma/client";
import { fetcher } from "@utils/fetcher";
import { useCallback, useState } from "react";

export function useProjects() {
  const { data, error } = useSWR<Project[]>("/api/projects", fetcher);
  const [creating, setCreating] = useState(false);
  const { mutate } = useSWRConfig();

  const createProject = useCallback(
    (project: Partial<Project>) => {
      setCreating(true);
      return mutate(
        "/api/projects",
        fetch("/api/projects", {
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
