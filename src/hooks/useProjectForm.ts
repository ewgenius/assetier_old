import { useCallback, useEffect, useMemo, useState } from "react";

import type { Project } from "@prisma/client";

import { useInputState } from "@hooks/useInputState";

export function useProjectForm(project?: Partial<Project>) {
  const [name, setName, resetName, setNameValue] = useInputState(project?.name);
  const [alias, setAlias, resetAlias, setAliasValue] = useInputState(
    project?.alias || undefined
  );
  const [assetsPath, setAssetsPath, resetAssetsPath, setAssetsPathValue] =
    useInputState(project?.assetsPath);
  const [publicPageEnabled, setPublicPageEnabled] = useState(
    project?.publicPageEnabled !== undefined ? project.publicPageEnabled : false
  );
  const [githubInstallation, setGithubInstallation] = useState<
    | (Pick<Project, "githubInstallationId" | "repositoryId"> & {
        branch: string;
      })
    | null
  >(
    project &&
      project.githubInstallationId &&
      project.repositoryId &&
      project.defaultBranch
      ? {
          githubInstallationId: project.githubInstallationId,
          repositoryId: project.repositoryId,
          branch: project.defaultBranch,
        }
      : null
  );

  const reset = useCallback(() => {
    if (project) {
      project.name && setNameValue(project.name);
      project.alias && setAliasValue(project.alias);
      project.assetsPath && setAssetsPathValue(project.assetsPath);
      project.publicPageEnabled !== undefined &&
        setPublicPageEnabled(project.publicPageEnabled);
    } else {
      resetName();
      resetAlias();
      resetAssetsPath();
      setPublicPageEnabled(false);
      setGithubInstallation(null);
    }
  }, [project]);

  useEffect(() => {
    reset();
  }, [project]);

  const projectData: Partial<Project> = useMemo(
    () => ({
      name,
      alias,
      assetsPath,
      publicPageEnabled,
      defaultBranch: githubInstallation?.branch,
      githubInstallationId: githubInstallation?.githubInstallationId as string,
      repositoryId: githubInstallation?.repositoryId as number,
    }),
    [
      name,
      alias,
      assetsPath,
      publicPageEnabled,
      githubInstallation?.branch,
      githubInstallation?.githubInstallationId,
      githubInstallation?.repositoryId,
    ]
  );

  console.log(githubInstallation);
  console.log(projectData);

  const isValid = useMemo(
    () =>
      project
        ? name
        : name &&
          githubInstallation?.githubInstallationId &&
          githubInstallation?.repositoryId &&
          githubInstallation?.branch,
    [
      name,
      project,
      githubInstallation?.githubInstallationId,
      githubInstallation?.repositoryId,
      githubInstallation?.branch,
    ]
  );

  return {
    reset,
    isValid,

    projectData,

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

    setNameValue,
    setAliasValue,
    setAssetsPathValue,
  };
}
