import { useCallback, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { Project } from "@prisma/client";

import { fetcher } from "@utils/fetcher";
import { useInputState } from "@hooks/useInputState";

export function useProjectsCreator(organizationId: string) {
  const { data, error } = useSWR<Project[]>(
    `/api/organizations/${organizationId}/projects`,
    fetcher
  );
  const [creating, setCreating] = useState(false);
  const { mutate } = useSWRConfig();

  const [name, setName, resetName] = useInputState();
  const [alias, setAlias, resetAlias] = useInputState();
  const [assetsPath, setAssetsPath, resetAssetsPath] = useInputState();
  const [publicPageEnabled, setPublicPageEnabled] = useState(false);
  const [githubInstallation, setGithubInstallation] = useState<Pick<
    Project,
    "githubInstallationId" | "repositoryId"
  > | null>(null);

  const reset = () => {
    resetName();
    resetAlias();
    resetAssetsPath();
    setPublicPageEnabled(false);
    setGithubInstallation(null);
  };

  const isValid = useMemo(
    () =>
      name &&
      githubInstallation?.githubInstallationId &&
      githubInstallation?.repositoryId,
    [name, githubInstallation]
  );

  const createProject = useCallback(() => {
    setCreating(true);

    const project: Partial<Project> = {
      name,
      alias,
      assetsPath,
      publicPageEnabled,
      githubInstallationId: githubInstallation?.githubInstallationId as string,
      repositoryId: githubInstallation?.repositoryId as number,
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
    name,
    alias,
    assetsPath,
    publicPageEnabled,
    githubInstallation,
  ]);

  return {
    projects: data,
    error,
    createProject,
    creating,

    reset,
    isValid,

    name,
    alias,
    assetsPath,
    publicPageEnabled,
    githubInstallation,

    setName,
    setAlias,
    setAssetsPath,
    setPublicPageEnabled,
    setGithubInstallation,
  };
}
