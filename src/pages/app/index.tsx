import { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DotsVerticalIcon } from "@heroicons/react/outline";

import { useInputState } from "@hooks/useInputState";
import { useProjects } from "@hooks/useProjects";
import type { NextPageExtended } from "@utils/types";
import { classNames } from "@utils/classNames";
import { Page } from "@components/Page";
import { LayoutBlock } from "@components/LayoutBlock";
import { Spinner } from "@components/Spinner";
import {
  SlideOver,
  SlideOverProps,
  SlideOverHeading,
} from "@components/SlideOver";

const ProjectsList = () => {
  const { projects } = useProjects();
  return projects ? (
    <ul
      role="list"
      className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map(
        (project) =>
          project && (
            <li
              key={project.name}
              className="col-span-1 flex shadow-sm rounded-md"
            >
              <div
                className={classNames(
                  "bg-pink-400",
                  "uppercase flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
                )}
              >
                {project.name.substring(0, 3)}
              </div>
              <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                <div className="flex-1 px-4 py-2 text-sm truncate">
                  <Link href={`/app/projects/${project.id}`}>
                    <a className="text-gray-900 font-medium hover:text-gray-600">
                      {project.name}
                    </a>
                  </Link>
                  <p className="text-gray-500 text-xs">{project.createdAt}</p>
                </div>
                <div className="flex-shrink-0 pr-2">
                  <button
                    type="button"
                    className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                  >
                    <span className="sr-only">Open options</span>
                    <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          )
      )}
    </ul>
  ) : (
    <div className="flex justify-center py-4">
      <Spinner />
    </div>
  );
};

const ProjectSlideOver: FC<SlideOverProps> = ({ open, onClose }) => {
  const { createProject, creating } = useProjects();
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
          <div className="px-4 divide-y divide-gray-200 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
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

export const Home: NextPageExtended = () => {
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  return (
    <Page>
      <LayoutBlock padding="lg">
        <div className="mb-8 flex">
          <button
            type="button"
            onClick={() => setNewProjectOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          >
            new project
          </button>
        </div>
        <ProjectsList />
      </LayoutBlock>
      <ProjectSlideOver
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
      />
    </Page>
  );
};

Home.type = "app";
Home.navId = "projects";

export default Home;
