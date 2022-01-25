import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import type { NextPageExtended } from "@assetier/types";
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
import { parseFigmaUrl } from "@utils/parseFigmaUrl";
import { FigmaConnector } from "@components/FigmaConnector/FigmaConnector";

export const ProjectSettingsPage: NextPageExtended<
  {},
  {},
  ProjectPageWrapperProps
> = () => {
  const router = useRouter();
  const project = useProjectContext();
  const { updateProject, updating, deleteProject, deleting, form } =
    useProjectUpdater(project);

  const parsedFigmaUrl = useMemo(
    () => parseFigmaUrl(form.figmaFileUrl),
    [form.figmaFileUrl]
  );

  const submit = useCallback(() => {
    if (form.isValid) {
      updateProject().then(close);
    }
  }, [form.isValid, updateProject]);

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
        <div className="flex flex-col space-y-4 py-4 sm:flex-row sm:space-x-8 sm:space-y-0">
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

            <div className="my-4 border-b border-gray-200" />

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

            <div className="my-4 border-b border-gray-200" />

            <FigmaConnector
              connectionId={project.figmaOauthConnectionId || undefined}
              onChange={form.setFigmaOauthConnectionId}
            />

            <div>
              <TextInput
                id="figma-file-url"
                name="figma-file-url"
                label="Figma file url"
                placeholder="https://www.figma.com/file/..."
                value={form.figmaFileUrl}
                onChange={form.setFigmaFileUrl}
              />

              {parsedFigmaUrl && (
                <div className="mt-2 font-mono text-xs text-gray-400">
                  <p>key: {parsedFigmaUrl.key}</p>
                  <p>title: {parsedFigmaUrl.title}</p>
                </div>
              )}
            </div>

            <div className="my-4 border-b border-gray-200" />

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

            <div className="my-4 border-b border-gray-200" />

            <button
              type="submit"
              disabled={updating || !form.isValid}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <span>Update</span>
              {updating && <Spinner className="ml-2" />}
            </button>

            <div className="my-4 border-b border-gray-200" />

            <button
              type="button"
              onClick={() =>
                deleteProject().then(() => {
                  router.push("/app");
                })
              }
              disabled={updating || deleting}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50"
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
