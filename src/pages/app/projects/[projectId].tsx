import type { NextPageExtended } from "@utils/types";
import { Page } from "@components/Page";
import { PageHeader } from "@components/PageHeader";
import { LayoutBlock } from "@components/LayoutBlock";
import { Spinner } from "@components/Spinner";
import { useProject } from "@hooks/useProject";
import { classNames } from "@utils/classNames";
import Link from "next/link";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

export const Project: NextPageExtended = () => {
  const { query } = useRouter();
  const { project } = useProject(query.projectId as string);
  return (
    <Page title={() => <PageHeader>Project: {project?.name}</PageHeader>}>
      <LayoutBlock>
        {project ? <div>{JSON.stringify(project)}</div> : <Spinner />}
      </LayoutBlock>
    </Page>
  );
};

Project.type = "app";
Project.navId = "project";

export default Project;
