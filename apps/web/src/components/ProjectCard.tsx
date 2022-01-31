import type { FC } from "react";
import Link from "next/link";
import type { Project } from "@assetier/prisma";

import { stringToColor } from "@utils/stringToColor";
import { useAccount } from "@hooks/useAccount";

export interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const { account } = useAccount();

  return (
    <li key={project.id} className="col-span-1 flex rounded-md shadow-sm">
      <Link href={`/app/${account.id}/projects/${project.id}`}>
        <a className="group flex max-w-full flex-grow">
          <div
            className="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium uppercase text-white"
            style={{
              backgroundColor: stringToColor(project.name),
            }}
          >
            {project.name.substring(0, 3)}
          </div>
          <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
            <div className="flex-1 truncate px-4 py-2 text-sm">
              <p className="truncate font-medium text-gray-900 group-hover:text-gray-600">
                {project.name}
              </p>
              <p className="truncate text-xs text-gray-500">
                {project.createdAt}
              </p>
            </div>
            {/* <div className="flex-shrink-0 pr-2">
              <button
                type="button"
                className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
              >
                <span className="sr-only">Open options</span>
                <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div> */}
          </div>
        </a>
      </Link>
    </li>
  );
};
