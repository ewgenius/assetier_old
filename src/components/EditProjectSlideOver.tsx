import { FC, useCallback } from "react";
import type { Project } from "@prisma/client";

import { useProjectsFactory } from "@hooks/useProjectsFactory";
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
import { Toggle } from "@components/Toggle";

export interface EditProjectSlideOverProps extends SlideOverProps {
  project: Partial<Project>;
}

export const EditProjectSlideOver: FC<EditProjectSlideOverProps> = ({
  open,
  onClose,
  project,
}) => {
  const { organization } = useAppContext();
  const {
    processProject: updateProject,
    processing: updating,
    form,
  } = useProjectsFactory(organization.id, project);

  const close = () => {
    setTimeout(() => form.reset(), 700);
    onClose();
  };

  // useEffect(() => form.reset(), []);

  const submit = useCallback(() => {
    if (form.isValid) {
      updateProject().then(close);
    }
  }, [
    form.name,
    form.alias,
    form.githubInstallation,
    form.assetsPath,
    form.publicPageEnabled,
    form.isValid,
  ]);

  return (
    <SlideOver open={open} onClose={close} onSubmit={submit}>
      <SlideOverHeading
        onClose={close}
        title={`Edit Project: "${project.name}"`}
      />

      <SlideOverBody>
        <TextInput
          id="project-name"
          name="project-name"
          label="Project name"
          placeholder="My Awesome Project"
          disabled={updating}
          value={form.name}
          onChange={form.setName}
        />

        <TextInput
          id="project-alias"
          name="project-alias"
          label="Project alias"
          placeholder="if not set, will be generated"
          disabled={updating}
          value={form.alias}
          onChange={form.setAlias}
        />

        <div className="border-b border-gray-200" />

        <TextInput
          id="assets-path"
          name="assets-path"
          label="Assets path"
          placeholder="/path/to/icons"
          disabled={updating}
          value={form.assetsPath}
          onChange={form.setAssetsPath}
        />

        <Toggle
          label="Enable public page?"
          checked={form.publicPageEnabled}
          onChange={form.setPublicPageEnabled}
        />
      </SlideOverBody>

      <SlideOverFooter>
        <button
          type="button"
          className="bg-white py-2 px-4 border disabled:opacity-50 border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          disabled={updating}
          onClick={close}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updating || !form.isValid}
          className="ml-4 inline-flex items-center disabled:opacity-50 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        >
          <span>Update</span>
          {updating && <Spinner className="ml-2" />}
        </button>
      </SlideOverFooter>
    </SlideOver>
  );
};
