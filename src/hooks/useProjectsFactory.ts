import { useCallback, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { Project } from "@prisma/client";

import { fetcher } from "@utils/fetcher";
import { useProjectForm } from "@hooks/useProjectForm";

export function useProjectsFactory(
  organizationId: string,
  project?: Partial<Project>
) {
  const { data, error } = useSWR<Project[]>(
    `/api/organizations/${organizationId}/projects`,
    fetcher
  );
  const [processing, setProcessing] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useProjectForm(project);

  const processProject = useCallback(() => {
    setProcessing(true);

    return mutate(
      `/api/organizations/${organizationId}/projects`,
      fetch(
        `/api/organizations/${organizationId}/projects${
          project ? `/${project.id}` : ""
        }`,
        {
          method: project ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form.projectData),
        }
      )
        .then((r) => r.json())
        .then((newProject) => [...(data || []), newProject])
        .finally(() => setProcessing(false))
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
    processProject,
    processing,
    form,
  };
}
