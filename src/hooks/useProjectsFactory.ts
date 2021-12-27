import { useCallback, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { Project } from "@prisma/client";

import { fetcher } from "@utils/fetcher";
import { useOrganization } from "@hooks/useOrganization";
import { useProjectForm } from "@hooks/useProjectForm";

export function useProjectsFactory(project?: Partial<Project>) {
  const organization = useOrganization();
  const apiKey = project
    ? [
        `/api/organizations/${organization.id}/projects/${project.id}`,
        organization,
        project,
      ]
    : [`/api/organizations/${organization.id}/projects`, organization];

  const { data, error } = useSWR<Project[]>(apiKey, fetcher);
  const [processing, setProcessing] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useProjectForm(project);

  const processProject = useCallback(() => {
    setProcessing(true);

    return mutate(
      apiKey,
      fetch(
        project
          ? `/api/organizations/${organization.id}/projects/${project.id}`
          : `/api/organizations/${organization.id}/projects`,
        {
          method: project ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form.projectData),
        }
      )
        .then((r) => r.json())
        .then((newProject) =>
          project ? newProject : [...(data || []), newProject]
        )
        .finally(() => setProcessing(false))
    );
  }, [
    organization,
    project,
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
    processProject,
    processing,
    form,
  };
}
