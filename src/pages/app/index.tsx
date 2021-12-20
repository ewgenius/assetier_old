import type { NextPageExtended } from "@utils/types";
import { Page } from "@components/Page";
import { PageHeader } from "@components/PageHeader";
import { LayoutBlock } from "@components/LayoutBlock";
import { Spinner } from "@components/Spinner";
import { useProjects } from "@hooks/useProjects";
import { classNames } from "@utils/classNames";
import Link from "next/link";
import { DotsVerticalIcon } from "@heroicons/react/outline";

export const Home: NextPageExtended = () => {
  const { projects } = useProjects();
  return (
    <Page title={() => <PageHeader>Projects</PageHeader>}>
      <LayoutBlock>
        {projects ? (
          <ul
            role="list"
            className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
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
                      className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Open options</span>
                      <DotsVerticalIcon
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Spinner />
        )}
      </LayoutBlock>
    </Page>
  );
};

Home.type = "app";
Home.navId = "projects";

export default Home;
