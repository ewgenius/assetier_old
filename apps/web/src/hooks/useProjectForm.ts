import { useCallback, useEffect, useMemo, useState } from "react";

import type { Project } from "@assetier/prisma";

import { useInputState } from "@hooks/useInputState";
import type { GithubConnection } from "@utils/types";

export function useProjectForm(project?: Partial<Project>) {
  const [name, setName, resetName, setNameValue] = useInputState(project?.name);
  const [alias, setAlias, resetAlias, setAliasValue] = useInputState(
    project?.alias || undefined
  );
  const [figmaOauthConnectionId, setFigmaOauthConnectionId] = useState(
    project?.figmaOauthConnectionId
  );
  const [
    figmaFileUrl,
    setFigmaFileUrl,
    resetFigmaFileUrl,
    setFigmaFileUrlValue,
  ] = useInputState(project?.figmaFileUrl || undefined);
  const [assetsPath, setAssetsPath, resetAssetsPath, setAssetsPathValue] =
    useInputState(project?.assetsPath);
  const [publicPageEnabled, setPublicPageEnabled] = useState(
    project?.publicPageEnabled !== undefined ? project.publicPageEnabled : false
  );
  const [githubInstallation, setGithubInstallation] =
    useState<GithubConnection | null>(
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
      project.figmaFileUrl && setFigmaFileUrlValue(project.figmaFileUrl);
      project.figmaOauthConnectionId &&
        setFigmaOauthConnectionId(project.figmaOauthConnectionId);
      project.assetsPath && setAssetsPathValue(project.assetsPath);
      project.publicPageEnabled !== undefined &&
        setPublicPageEnabled(project.publicPageEnabled);
    } else {
      resetName();
      resetAlias();
      resetFigmaFileUrl();
      resetAssetsPath();
      setPublicPageEnabled(false);
      setGithubInstallation(null);
      setFigmaOauthConnectionId(null);
    }
  }, [project]);

  useEffect(() => {
    reset();
  }, [project]);

  const projectData: Partial<Project> = useMemo(() => {
    const data: Partial<Project> = {
      name,
      assetsPath,
      figmaFileUrl,
      figmaOauthConnectionId,
      publicPageEnabled,
      defaultBranch: githubInstallation?.branch,
      githubInstallationId: githubInstallation?.githubInstallationId as string,
      repositoryId: githubInstallation?.repositoryId as number,
    };
    if (alias) {
      data.alias = alias;
    }
    return data;
  }, [
    name,
    alias,
    figmaFileUrl,
    figmaOauthConnectionId,
    assetsPath,
    publicPageEnabled,
    githubInstallation?.branch,
    githubInstallation?.githubInstallationId,
    githubInstallation?.repositoryId,
  ]);

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
    figmaFileUrl,
    figmaOauthConnectionId,
    assetsPath,
    publicPageEnabled,
    githubInstallation,

    setName,
    setAlias,
    setFigmaFileUrl,
    setFigmaOauthConnectionId,
    setAssetsPath,
    setPublicPageEnabled,
    setGithubInstallation,

    setNameValue,
    setAliasValue,
    setFigmaFileUrlValue,
    setAssetsPathValue,
  };
}
