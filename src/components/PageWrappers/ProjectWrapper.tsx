import { createContext, FC, PropsWithChildren, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import type { Project } from "@prisma/client";
import { useProject } from "@hooks/useProject";
import { Page } from "@components/Page";
import { LayoutBlock } from "@components/LayoutBlock";
import { classNames } from "@utils/classNames";
import { Spinner } from "@components/Spinner";

export type ProjectPageTabId = "index" | "settings" | "uploads";

export interface ProjectPageTab {
  id: ProjectPageTabId;
  name: string;
  href: string;
}

const tabs: ProjectPageTab[] = [
  { id: "index", name: "Contents", href: "" },
  { id: "uploads", name: "Uploads", href: "" },
  { id: "settings", name: "Settings", href: "settings" },
];

export interface ProjectPageWrapperProps {
  tabId: ProjectPageTabId;
}

export interface ProjectPageWrapperContextInterface {
  project?: Project;
}

export const ProjectPageWrapperContext =
  createContext<ProjectPageWrapperContextInterface>({});

export const useProjectContext = () => {
  const { project } = useContext(ProjectPageWrapperContext);
  return project as Project;
};

export const ProjectPageWrapper: FC<
  PropsWithChildren<ProjectPageWrapperProps>
> = ({ children, tabId }) => {
  const { query } = useRouter();
  const { project } = useProject(query.projectId as string);

  if (!project) {
    return (
      <LayoutBlock>
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      </LayoutBlock>
    );
  }

  return (
    <Page
      title={() => (
        <LayoutBlock mode="primary" borderBottom borderTop padding="none">
          <div className="pt-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl leading-8 font-medium text-gray-900 truncate">
                  {project.name}
                </h2>
              </div>

              <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
                {/* <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                >
                  Edit
                </button> */}
              </div>
            </div>

            <div className="mt-3 sm:mt-4">
              <nav className="-mb-px flex space-x-4">
                {tabs.map((tab) => {
                  const isCurrent = tab.id === tabId;
                  return (
                    <Link
                      key={tab.id}
                      href={`/app/projects/${project.id}/${tab.href}`}
                    >
                      <a
                        className={classNames(
                          isCurrent
                            ? "border-zinc-500 text-zinc-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                          "whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm"
                        )}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        {tab.name}
                      </a>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </LayoutBlock>
      )}
    >
      <ProjectPageWrapperContext.Provider value={{ project }}>
        {children}
      </ProjectPageWrapperContext.Provider>
    </Page>
  );
};
