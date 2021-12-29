import { useCallback } from "react";

import type { NextPageExtended } from "@utils/types";
import {
  ProjectPageWrapper,
  ProjectPageWrapperProps,
  useProjectContext,
} from "@components/PageWrappers/ProjectWrapper";
import { LayoutBlock } from "@components/LayoutBlock";
import { Spinner } from "@components/Spinner";

import { TextInput } from "@components/TextInput";
import { Toggle } from "@components/Toggle";
import { useProjectUpdater } from "@hooks/useProjectUpdater";

export const ProjectSettingsPage: NextPageExtended<
  {},
  {},
  ProjectPageWrapperProps
> = () => {
  const project = useProjectContext();
  const { updateProject, updating, form } = useProjectUpdater(project);

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
    updateProject,
  ]);

  if (!project) {
    return null;
  }

  return (
    <LayoutBlock>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
          return false;
        }}
        className="flex flex-col space-y-4"
      >
        <div className="py-4 flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0">
          <div className="flex-1 space-y-4">
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

            <TextInput
              id="default-branch"
              name="default-branch"
              label="Default branch"
              placeholder="main"
              disabled={updating}
              value={form.defaultBranch}
              onChange={form.setDefaultBranch}
            />
          </div>
          <div className="border-b border-gray-200 sm:hidden" />

          <div className="flex-1 space-y-4">
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
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={updating || !form.isValid}
            className="inline-flex items-center disabled:opacity-50 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          >
            <span>Update</span>
            {updating && <Spinner className="ml-2" />}
          </button>
        </div>
      </form>
    </LayoutBlock>
  );
};

ProjectSettingsPage.type = "app";
ProjectSettingsPage.navId = "project";
ProjectSettingsPage.Wrapper = ProjectPageWrapper;
ProjectSettingsPage.wrapperProps = {
  tabId: "settings",
};

export default ProjectSettingsPage;
