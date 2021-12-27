import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { useProjectsCreator } from "@hooks/useProjectsCreator";
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
  const {
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
  } = useProjectsCreator(organization.id);

  const close = () => {
    setTimeout(() => reset(), 700);
    onClose();
  };

  useEffect(() => reset(), []);

  const submit = useCallback(() => {
    if (isValid) {
      createProject().then(close);
    }
  }, [name, alias, githubInstallation, assetsPath, publicPageEnabled, isValid]);

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
          value={name}
          onChange={setName}
        />

        <TextInput
          id="project-alias"
          name="project-alias"
          label="Project alias"
          placeholder="if not set, will be generated"
          disabled={creating}
          value={alias}
          onChange={setAlias}
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
