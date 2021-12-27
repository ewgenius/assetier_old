import { useCallback, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { Project } from "@prisma/client";

import { fetcher } from "@utils/fetcher";
import { useProjectForm } from "@hooks/useProjectForm";

export function useProjectsCreator(organizationId: string) {
  const { data, error } = useSWR<Project[]>(
    `/api/organizations/${organizationId}/projects`,
    fetcher
  );
  const [creating, setCreating] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useProjectForm();

  const createProject = useCallback(() => {
    setCreating(true);

    const project: Partial<Project> = {
      name: form.name,
      alias: form.alias,
      assetsPath: form.assetsPath,
      publicPageEnabled: form.publicPageEnabled,
      githubInstallationId: form.githubInstallation
        ?.githubInstallationId as string,
      repositoryId: form.githubInstallation?.repositoryId as number,
    };

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
  }, [
    data,
    organizationId,
    form.name,
    form.alias,
    form.assetsPath,
    form.publicPageEnabled,
    form.githubInstallation,
  ]);

  return {
    projects: data,
    error,
    createProject,
    creating,
    form,
  };
}
