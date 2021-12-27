import Link from "next/link";
import { DotsVerticalIcon } from "@heroicons/react/outline";

import { useProjects } from "@hooks/useProjects";
import { Spinner } from "@components/Spinner";
import { stringToColor } from "@utils/stringToColor";

export const ProjectsList = () => {
  const { projects } = useProjects();
  return projects ? (
    <ul
      role="list"
      className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Object.values(projects).map(
        (project) =>
          project && (
            <li
              key={project.id}
              className="col-span-1 flex shadow-sm rounded-md"
            >
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
