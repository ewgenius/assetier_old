import { useCallback, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { Project } from "@prisma/client";

import { fetcher } from "@utils/fetcher";
import { useOrganization } from "@hooks/useOrganization";
import { useProjectForm } from "@hooks/useProjectForm";
import { useProjects } from "./useProjects";

export function useProjectUpdater(project: Partial<Project>) {
  const organization = useOrganization();
  const apiKey = [
    `/api/organizations/${organization.id}/projects/${project.id}`,
    organization,
    project.id,
  ];

  const { projects } = useProjects();
  const { data, error } = useSWR<Project[]>(apiKey, fetcher);
  const [updating, setUpdating] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useProjectForm(project);

  const updateProject = useCallback(() => {
    setUpdating(true);

    return mutate(
      [
        `/api/organizations/${organization.id}/projects/${project.id}`,
        organization,
        project.id,
      ],
      fetch(`/api/organizations/${organization.id}/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.projectData),
      })
        .then((r) => r.json())
        .then((updatedProject: Project) => {
          mutate(
            [`/api/organizations/${organization.id}/projects`, organization],
            {
              ...projects,
              [updatedProject.id]: updatedProject,
            }
          );
          return updatedProject;
        })
        .finally(() => setUpdating(false))
    );
  }, [
    organization,
    projects,
    project,
    data,
    form.name,
    form.alias,
    form.assetsPath,
    form.publicPageEnabled,
    form.githubInstallation,
  ]);

  return {
    project: data,
    error,
    updateProject,
    updating,
    form,
  };
}
