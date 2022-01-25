import { useState } from "react";

import type { NextPageExtended } from "@assetier/types";
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
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
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
