import { useCallback, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { Project } from "@assetier/prisma";

import { fetcher } from "@utils/fetcher";
import { useAccount } from "@hooks/useAccount";
import { useProjectForm } from "@hooks/useProjectForm";
import { useProjects } from "./useProjects";

export function useProjectUpdater(project: Partial<Project>) {
  const { account } = useAccount();
  const apiKey = [
    `/api/accounts/${account.id}/projects/${project.id}`,
    account,
    project.id,
  ];

  const { projects } = useProjects();
  const { data, error } = useSWR<Project[]>(apiKey, fetcher);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useProjectForm(project);

  const updateProject = useCallback(() => {
    setUpdating(true);

    return mutate(
      [
        `/api/accounts/${account.id}/projects/${project.id}`,
        account,
        project.id,
      ],
      fetch(`/api/accounts/${account.id}/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.projectData),
      })
        .then((r) => r.json())
        .then((updatedProject: Project) => {
          mutate([`/api/accounts/${account.id}/projects`, account], {
            ...projects,
            [updatedProject.id]: updatedProject,
          });
          return updatedProject;
        })
        .finally(() => setUpdating(false))
    );
  }, [account, projects, form.projectData, project, mutate]);

  const deleteProject = useCallback(() => {
    setDeleting(true);

    return fetcher(`/api/accounts/${account.id}/projects/${project.id}`, {
      method: "DELETE",
    })
      .then((deletedProject: Project) => {
        // mutate(
        //   [
        //     `/api/accounts/${account.id}/projects/${deletedProject.id}`,
        //     account,
        //     deletedProject.id,
        //   ],
        //   undefined,
        //   false
        // );
        return mutate([`/api/accounts/${account.id}/projects`, account], {
          ...projects,
          [deletedProject.id]: undefined,
        });
      })
      .finally(() => setDeleting(false));
  }, [account, projects, project, data]);

  return {
    project: data,
    error,
    updateProject,
    deleteProject,
    updating,
    deleting,
    form,
  };
}
