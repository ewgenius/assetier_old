import type { NextPageExtended } from "@utils/types";
import { Page } from "@components/Page";
import { PageHeader } from "@components/PageHeader";
import { LayoutBlock } from "@components/LayoutBlock";
import { Spinner } from "@components/Spinner";
import { useProjects } from "@hooks/useProjects";

export const Home: NextPageExtended = () => {
  const { projects } = useProjects();
  return (
    <Page title={() => <PageHeader>Projects</PageHeader>}>
      <LayoutBlock>
        {projects ? (
          projects.map((project) => {
            return <div key={project.id}>{project.name}</div>;
          })
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
