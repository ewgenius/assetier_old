import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";

import { useOrganization } from "@hooks/useOrganization";
import { useProjectForm } from "@hooks/useProjectForm";
import { useProjects } from "@hooks/useProjects";
import { fetcher } from "@utils/fetcher";

export function useProjectCreator() {
  const { organization } = useOrganization();
  const { projects } = useProjects();
  const [creating, setCreating] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useProjectForm();

  const createProject = useCallback(() => {
    setCreating(true);

    return mutate(
      [`/api/organizations/${organization.id}/projects`, organization],
      fetcher(`/api/organizations/${organization.id}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.projectData),
      })
        .then((newProject) =>
          mutate(
            [
              `/api/organizations/${organization.id}/projects/${newProject.id}`,
              organization,
              newProject.id,
            ],
            newProject,
            false
          )
        )
        .then((newProject) => {
          return {
            ...projects,
            [newProject.id]: newProject,
          };
        })
        .catch((err) => {
          // TODO: handle error properly
          console.log(err);
          return projects;
        })
        .finally(() => setCreating(false)),
      false
    );
  }, [organization, form.projectData, projects, mutate]);

  return {
    createProject,
    creating,
    form,
  };
}
