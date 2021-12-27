import { useCallback, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { Project } from "@prisma/client";

import { fetcher } from "@utils/fetcher";
import { useOrganization } from "@hooks/useOrganization";
import { useProjectForm } from "@hooks/useProjectForm";

export function useProjectsFactory() {
  const organization = useOrganization();
  const apiKey = [
    `/api/organizations/${organization.id}/projects`,
    organization,
  ];

  const { data, error } = useSWR<Project[]>(apiKey, fetcher);
  const [creating, setCreating] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useProjectForm();

  const createProject = useCallback(() => {
    setCreating(true);

    return mutate(
      apiKey,
      fetch(`/api/organizations/${organization.id}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.projectData),
      })
        .then((r) => r.json())
        .then((newProject) =>
          mutate(
            `/api/organizations/${organization.id}/projects/${newProject.id}`,
            newProject
          )
        )
        .then((newProject) => {
          return [...(data || []), newProject];
        })
        .finally(() => setCreating(false))
    );
  }, [
    organization,
    data,
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
