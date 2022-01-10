import type { NextPageExtended } from "lib-types";
import type { ProjectPageWrapperProps } from "@components/PageWrappers/ProjectWrapper";
import { ProjectPageWrapper } from "@components/PageWrappers/ProjectWrapper";
import { LayoutBlock } from "@components/LayoutBlock";

export const ProjectUploadsPage: NextPageExtended<
  {},
  {},
  ProjectPageWrapperProps
> = () => {
  return <LayoutBlock>uploads...</LayoutBlock>;
};

ProjectUploadsPage.type = "app";
ProjectUploadsPage.navId = "project";
ProjectUploadsPage.Wrapper = ProjectPageWrapper;
ProjectUploadsPage.wrapperProps = {
  tabId: "uploads",
};

export default ProjectUploadsPage;
