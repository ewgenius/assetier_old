import type { FC } from "react";
import Link from "next/link";
import type { Project } from "lib-prisma";

import { stringToColor } from "@utils/stringToColor";
import { useOrganization } from "@hooks/useOrganization";

export interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const { organization } = useOrganization();

  return (
    <li key={project.id} className="col-span-1 flex shadow-sm rounded-md">
      <Link href={`/app/${organization.id}/projects/${project.id}`}>
        <a className="flex flex-grow group max-w-full">
          <div
            className="uppercase flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
            style={{
              backgroundColor: stringToColor(project.name),
            }}
          >
            {project.name.substring(0, 3)}
          </div>
          <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
            <div className="flex-1 px-4 py-2 text-sm truncate">
              <p className="text-gray-900 font-medium truncate group-hover:text-gray-600">
                {project.name}
              </p>
              <p className="text-gray-500 truncate text-xs">
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
