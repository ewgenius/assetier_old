import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { Page } from "@components/Page";
import type { NextPageExtended } from "@utils/types";
import { LayoutBlock } from "@components/LayoutBlock";

export const Project: NextPageExtended = () => {
  return (
    <Page
      title={() => (
        <LayoutBlock mode="primary" borderBottom>
          <div>
            <nav className="sm:hidden" aria-label="Back">
              <a
                href="#"
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <ChevronLeftIcon
                  className="flex-shrink-0 -ml-1 mr-1 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                Back
              </a>
            </nav>
            <nav className="hidden sm:flex" aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-4">
                <li>
                  <div className="flex">
                    <a
                      href="#"
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Projects
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="flex-shrink-0 h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                    <a
                      href="#"
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Project #1
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Project #1
              </h2>
            </div>
            <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
              >
                Edit
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
              >
                Publish
              </button>
            </div>
          </div>
        </LayoutBlock>
      )}
    >
      <LayoutBlock borderBottom>
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
      </LayoutBlock>
      <LayoutBlock mode="primary">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-[812px]" />
      </LayoutBlock>
    </Page>
  );
};

Project.type = "app";
Project.navId = "project";

export default Project;
