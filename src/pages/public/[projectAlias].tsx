import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { Project } from "@prisma/client";

import { prisma } from "@utils/prisma";
import type { GithubFile } from "@utils/types";
import { getProjectRepositoryContents } from "@utils/getProjectRepositoryContents";
import { Page } from "@components/Page";
import { LayoutBlock } from "@components/LayoutBlock";
import { PageHeader } from "@components/PageHeader";
import { AssetCard } from "@components/AssetCard";

export interface ProjectPublicPageProps {
  project?: Pick<Project, "name">;
  contents?: GithubFile[];
}

export const ProjectPublicPage: NextPage<ProjectPublicPageProps> = ({
  project,
  contents,
}) => {
  if (!project || !contents) {
    return null;
  }
  return (
    <Page title={() => <PageHeader>{project.name}</PageHeader>}>
      <LayoutBlock>
        <div className="mt-4 grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-1">
          {contents.map((asset) => (
            <AssetCard key={asset.sha} asset={asset} />
          ))}
        </div>
      </LayoutBlock>
    </Page>
  );
};

export const getStaticProps: GetStaticProps<
  ProjectPublicPageProps,
  { projectAlias: string }
> = async ({ params }) => {
  const project = await prisma.project.findUnique({
    where: {
      alias: params?.projectAlias,
    },
  });

  if (!project || !project.publicPageEnabled) {
    return {
      props: {},
      revalidate: 10,
    };
  }

  const contents = await getProjectRepositoryContents(project);

  return {
    props: {
      project: {
        name: project.name,
      },
      contents,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true };
};

export default ProjectPublicPage;
