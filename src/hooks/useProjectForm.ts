import { useMemo, useState } from "react";

import type { Project } from "@prisma/client";

import { useInputState } from "@hooks/useInputState";

export function useProjectForm() {
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

  return {
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
