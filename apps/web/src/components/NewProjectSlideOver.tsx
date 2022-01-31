import type { FC } from "react";
import { useCallback, useEffect, useMemo } from "react";

import { Spinner } from "@components/Spinner";
import type { SlideOverProps } from "@components/SlideOver";
import {
  SlideOver,
  SlideOverHeading,
  SlideOverFooter,
  SlideOverBody,
} from "@components/SlideOver";
import { TextInput } from "@components/TextInput";
import { GithubConnector } from "@components/GithubConnector";
import { Toggle } from "@components/Toggle";
import { useProjectCreator } from "@hooks/useProjectCreator";
import { useAccount } from "@hooks/useAccount";
import { useProjects } from "@hooks/useProjects";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { parseFigmaUrl } from "@utils/parseFigmaUrl";

export const NewProjectSlideOver: FC<SlideOverProps> = ({ open, onClose }) => {
  const { account } = useAccount();
  const { projects } = useProjects();
  const { createProject, creating, form } = useProjectCreator();

  const parsedFigmaUrl = useMemo(
    () => parseFigmaUrl(form.figmaFileUrl),
    [form.figmaFileUrl]
  );

  const reachedLimit = useMemo(
    () =>
      projects &&
      (!account.subscription ||
        Object.keys(projects).length >=
          account.subscription.subscriptionPlan.projectsLimit),
    [account, account.subscription, projects]
  );

  const close = useCallback(() => {
    setTimeout(() => form.reset(), 700);
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => form.reset(), []);

  const submit = useCallback(() => {
    if (form.isValid) {
      createProject().then(close);
    }
  }, [form.isValid, close, createProject]);

  return (
    <SlideOver open={open} onClose={close} onSubmit={submit}>
      <SlideOverHeading onClose={close} title="New Project" />

      {reachedLimit && (
        <div className="flex items-center gap-2 bg-zinc-200 px-4 py-2 text-zinc-600 sm:px-6">
          <ExclamationCircleIcon className="h-5 w-5" />
          <span className="flex-grow text-sm">
            You&apos;ve reached projects limit
          </span>
          <button
            type="button"
            className="inline-flex items-center rounded border border-transparent bg-zinc-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
          >
            Upgrade
          </button>
        </div>
      )}

      <SlideOverBody>
        <TextInput
          id="project-name"
          name="project-name"
          label="Project name"
          placeholder="My Awesome Project"
          disabled={reachedLimit || creating}
          value={form.name}
          onChange={form.setName}
        />

        <div className="border-b border-gray-200" />

        <GithubConnector
          onChange={form.setGithubInstallation}
          layout="column"
          disabled={reachedLimit || creating}
        />

        <TextInput
          id="assets-path"
          name="assets-path"
          label="Assets path"
          placeholder="/path/to/icons"
          disabled={reachedLimit || creating}
          value={form.assetsPath}
          onChange={form.setAssetsPath}
        />

        <div className="border-b border-gray-200" />

        <div>
          <TextInput
            id="figma-file-url"
            name="figma-file-url"
            label="Figma file url"
            placeholder="https://www.figma.com/file/..."
            disabled={reachedLimit || creating}
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

        <div className="border-b border-gray-200" />

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
            disabled={reachedLimit || creating}
            value={form.alias}
            onChange={form.setAlias}
          />
        )}
      </SlideOverBody>

      <SlideOverFooter>
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={creating}
          onClick={close}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={reachedLimit || creating || !form.isValid}
          className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <span>Create</span>
          {creating && <Spinner className="ml-2" />}
        </button>
      </SlideOverFooter>
    </SlideOver>
  );
};
