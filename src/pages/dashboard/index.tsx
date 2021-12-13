import type { NextPageExtended } from "@utils/types";
import { Page } from "@components/Page";
import { PageHeader } from "@components/PageHeader";

export const Home: NextPageExtended = () => {
  return (
    <Page title={() => <PageHeader>Projects</PageHeader>}>
      <div className="px-4 py-8 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
      </div>
    </Page>
  );
};

Home.navId = "projects";

export default Home;
