import type { NextPageExtended } from "@utils/types";
import { Page } from "@components/Page";
import { PageHeader } from "@components/PageHeader";
import { LayoutBlock } from "@components/LayoutBlock";
import { AuthBlock } from "@components/AuthBlock";

export const Home: NextPageExtended = () => {
  return (
    <Page title={() => <PageHeader>Projects</PageHeader>}>
      <LayoutBlock>
        <AuthBlock />
      </LayoutBlock>
      <LayoutBlock>
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
      </LayoutBlock>
    </Page>
  );
};

Home.navId = "projects";

export default Home;
