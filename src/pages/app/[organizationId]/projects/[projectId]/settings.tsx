import { useCallback } from "react";
import { useRouter } from "next/router";

import type { NextPageExtended } from "@utils/types";
import {
  ProjectPageWrapper,
  useProjectContext,
} from "@components/PageWrappers/ProjectWrapper";
import type { ProjectPageWrapperProps } from "@components/PageWrappers/ProjectWrapper";
import { LayoutBlock } from "@components/LayoutBlock";
import { Spinner } from "@components/Spinner";

import { TextInput } from "@components/TextInput";
import { Toggle } from "@components/Toggle";
import { useProjectUpdater } from "@hooks/useProjectUpdater";
import { GithubConnector } from "@components/GithubConnector";

export const ProjectSettingsPage: NextPageExtended<
  {},
  {},
  ProjectPageWrapperProps
> = () => {
  const router = useRouter();
  const project = useProjectContext();
  const { updateProject, updating, deleteProject, deleting, form } =
    useProjectUpdater(project);

  const submit = useCallback(() => {
    if (form.isValid) {
      updateProject().then(close);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

            <div className="border-b border-gray-200 my-4" />

            <GithubConnector
              connection={form.githubInstallation}
              onChange={form.setGithubInstallation}
              layout="column"
            />

            <TextInput
              id="assets-path"
              name="assets-path"
              label="Assets path"
              placeholder="/path/to/icons"
              disabled={updating}
              value={form.assetsPath}
              onChange={form.setAssetsPath}
            />

            <div className="border-b border-gray-200 my-4" />

            <Toggle
              label="Enable public page?"
              description={`https://assetier.app/public/${
                form.alias || "<project-alias>"
              }`}
              checked={form.publicPageEnabled}
              onChange={form.setPublicPageEnabled}
            />
            {form.publicPageEnabled && (
              <TextInput
                id="project-alias"
                name="project-alias"
                label="Project alias"
                placeholder="if not set, will be generated"
                disabled={updating}
                value={form.alias}
                onChange={form.setAlias}
              />
            )}

            <div className="border-b border-gray-200 my-4" />

            <button
              type="submit"
              disabled={updating || !form.isValid}
              className="inline-flex items-center disabled:opacity-50 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
            >
              <span>Update</span>
              {updating && <Spinner className="ml-2" />}
            </button>

            <div className="border-b border-gray-200 my-4" />

            <button
              type="button"
              onClick={() =>
                deleteProject().then(() => {
                  router.push("/app");
                })
              }
              disabled={updating || deleting}
              className="inline-flex items-center disabled:opacity-50 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
            >
              <span>Delete project</span>
              {deleting && <Spinner className="ml-2" />}
            </button>
          </div>

          <div className="flex-1 space-y-4" />
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
