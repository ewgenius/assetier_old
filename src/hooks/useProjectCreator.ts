import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";

import { useOrganization } from "@hooks/useOrganization";
import { useProjectForm } from "@hooks/useProjectForm";
import { useProjects } from "@hooks/useProjects";

export function useProjectCreator() {
  const organization = useOrganization();
  const { projects } = useProjects();
  const [creating, setCreating] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useProjectForm();

  const createProject = useCallback(() => {
    setCreating(true);

    return mutate(
      [`/api/organizations/${organization.id}/projects`, organization],
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
            [
              `/api/organizations/${organization.id}/projects/${newProject.id}`,
              organization.id,
              newProject.id,
            ],
            newProject,
            false
          )
        )
        .then((newProject) => {
          console.log(newProject, projects);
          return {
            ...projects,
            [newProject.id]: newProject,
          };
        })
        .finally(() => setCreating(false)),
      false
    );
  }, [
    organization.id,
    form.name,
    form.alias,
    form.assetsPath,
    form.publicPageEnabled,
    form.githubInstallation,
  ]);

  return {
    createProject,
    creating,
    form,
  };
}
