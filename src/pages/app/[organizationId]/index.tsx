import { useState } from "react";

import type { NextPageExtended } from "@utils/types";
import { Page } from "@components/Page";
import { LayoutBlock } from "@components/LayoutBlock";
import { NewProjectSlideOver } from "@components/NewProjectSlideOver";
import { ProjectsList } from "@components/ProjectsList";

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
      <NewProjectSlideOver
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
      />
    </Page>
  );
};

Home.type = "app";
Home.navId = "projects";

export default Home;
