import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";

import { useAccount } from "@hooks/useAccount";
import { useProjectForm } from "@hooks/useProjectForm";
import { useProjects } from "@hooks/useProjects";
import { fetcher } from "@utils/fetcher";

export function useProjectCreator() {
  const { account } = useAccount();
  const { projects } = useProjects();
  const [creating, setCreating] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useProjectForm();

  const createProject = useCallback(() => {
    setCreating(true);

    return mutate(
      [`/api/accounts/${account.id}/projects`, account],
      fetcher(`/api/accounts/${account.id}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.projectData),
      })
        .then((newProject) =>
          mutate(
            [
              `/api/accounts/${account.id}/projects/${newProject.id}`,
              account,
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
  }, [account, form.projectData, projects, mutate]);

  return {
    createProject,
    creating,
    form,
  };
}
