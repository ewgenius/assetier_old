import { FC, useCallback, useEffect, useState } from "react";

import { useInputState } from "@hooks/useInputState";
import { useProjects } from "@hooks/useProjects";
import { Spinner } from "@components/Spinner";
import {
  SlideOver,
  SlideOverProps,
  SlideOverHeading,
} from "@components/SlideOver";
import { useAppContext } from "@hooks/useAppContext";
import { RepositorySelector } from "@components/RepositorySelector";
import { GithubAccountSelector } from "./GithubAccountSelector";

export const ProjectSlideOver: FC<SlideOverProps> = ({ open, onClose }) => {
  const { organization } = useAppContext();
  const { createProject, creating } = useProjects(organization.id);
  const [projectName, setProjectName, resetProjectName] = useInputState();

  const close = () => {
    setTimeout(() => {
      resetProjectName();
    }, 700);
    onClose();
  };

  useEffect(() => {
    resetProjectName();
  }, []);

  const submit = useCallback(() => {
    createProject({
      name: projectName,
    }).then(close);
  }, [projectName]);

  return (
    <SlideOver open={open} onClose={close} onSubmit={submit}>
      <div className="flex-1 h-0 overflow-y-auto">
        <SlideOverHeading onClose={close} title="New Project" />

        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 sm:px-6">
            <div className="space-y-4 pt-6 pb-5">
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Project name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    placeholder="My Awesome Project"
                    disabled={creating}
                    name="project-name"
                    value={projectName}
                    onChange={setProjectName}
                    id="project-name"
                    className="block w-full shadow-sm disabled:opacity-50 sm:text-sm focus:ring-zinc-500 focus:border-zinc-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <GithubAccountSelector />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 py-4 flex justify-end">
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
          disabled={creating}
          className="ml-4 inline-flex items-center disabled:opacity-50 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        >
          <span>Create</span>
          {creating && <Spinner className="ml-2" />}
        </button>
      </div>
    </SlideOver>
  );
};
