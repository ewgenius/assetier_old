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
  const [githubInstallation, setGithubInstallation] = useState<Pick<
    Project,
    "githubInstallationId" | "repositoryId"
  > | null>(
    project && project.githubInstallationId && project.repositoryId
      ? {
          githubInstallationId: project.githubInstallationId,
          repositoryId: project.repositoryId,
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

  const projectData: Partial<Project> = {
    name,
    alias,
    assetsPath,
    publicPageEnabled,
    githubInstallationId: githubInstallation?.githubInstallationId as string,
    repositoryId: githubInstallation?.repositoryId as number,
  };

  const isValid = useMemo(
    () =>
      project
        ? name
        : name &&
          githubInstallation?.githubInstallationId &&
          githubInstallation?.repositoryId,
    [
      name,
      project,
      githubInstallation?.repositoryId,
      githubInstallation?.githubInstallationId,
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
  };
}
