import { FC, useCallback, useEffect, useMemo, useState } from "react";
import type { Project } from "@prisma/client";

import { useInputState } from "@hooks/useInputState";
import { useProjects } from "@hooks/useProjects";
import { Spinner } from "@components/Spinner";
import {
  SlideOver,
  SlideOverProps,
  SlideOverHeading,
  SlideOverFooter,
  SlideOverBody,
} from "@components/SlideOver";
import { useAppContext } from "@hooks/useAppContext";
import { TextInput } from "@components/TextInput";
import { GithubConnector } from "@components/GithubConnector";
import { Toggle } from "@components/Toggle";

export const NewProjectSlideOver: FC<SlideOverProps> = ({ open, onClose }) => {
  const { organization } = useAppContext();
  const { createProject, creating } = useProjects(organization.id);
  const [projectName, setProjectName, resetProjectName] = useInputState();
  const [projectAlias, setProjectAlias, resetProjectAlias] = useInputState();
  const [assetsPath, setAssetsPath, resetAssetsPath] = useInputState();
  const [publicPageEnabled, setPublicPageEnabled] = useState(false);
  const [githubInstallation, setGithubInstallation] = useState<Pick<
    Project,
    "githubInstallationId" | "repositoryId"
  > | null>(null);

  const close = () => {
    setTimeout(() => {
      resetProjectName();
      resetProjectAlias();
      resetAssetsPath();
      setPublicPageEnabled(false);
    }, 700);
    onClose();
  };

  useEffect(() => {
    resetProjectName();
    resetProjectAlias();
    resetAssetsPath();
    setPublicPageEnabled(false);
  }, []);

  const isValid = useMemo(
    () =>
      projectName &&
      githubInstallation?.githubInstallationId &&
      githubInstallation?.repositoryId,
    [projectName, githubInstallation]
  );

  const submit = useCallback(() => {
    if (isValid) {
      createProject({
        name: projectName,
        alias: projectAlias,
        githubInstallationId: githubInstallation?.githubInstallationId,
        repositoryId: githubInstallation?.repositoryId,
        assetsPath: assetsPath,
        publicPageEnabled: publicPageEnabled,
      }).then(close);
    }
  }, [
    projectName,
    projectAlias,
    githubInstallation,
    assetsPath,
    publicPageEnabled,
    isValid,
  ]);

  return (
    <SlideOver open={open} onClose={close} onSubmit={submit}>
      <SlideOverHeading onClose={close} title="New Project" />

      <SlideOverBody>
        <TextInput
          id="project-name"
          name="project-name"
          label="Project name"
          placeholder="My Awesome Project"
          disabled={creating}
          value={projectName}
          onChange={setProjectName}
        />

        <TextInput
          id="project-alias"
          name="project-alias"
          label="Project alias"
          placeholder="if not set, will be generated"
          disabled={creating}
          value={projectAlias}
          onChange={setProjectAlias}
        />

        <div className="border-b border-gray-200" />

        <GithubConnector onChange={setGithubInstallation} />

        <div className="border-b border-gray-200" />

        <TextInput
          id="assets-path"
          name="assets-path"
          label="Assets path"
          placeholder="/path/to/icons"
          disabled={creating}
          value={assetsPath}
          onChange={setAssetsPath}
        />

        <Toggle
          label="Enable public page?"
          checked={publicPageEnabled}
          onChange={setPublicPageEnabled}
        />
      </SlideOverBody>

      <SlideOverFooter>
        <button
          type="button"
          className="bg-white py-2 px-4 border disabled:opacity-50 border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          disabled={creating}
          onClick={close}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={creating || !isValid}
          className="ml-4 inline-flex items-center disabled:opacity-50 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        >
          <span>Create</span>
          {creating && <Spinner className="ml-2" />}
        </button>
      </SlideOverFooter>
    </SlideOver>
  );
};
