import type { NextPageExtended } from "@utils/types";
import { AssetsGrid } from "@components/AssetsGrid";
import {
  ProjectPageWrapper,
  ProjectPageWrapperProps,
  useProjectContext,
} from "@components/PageWrappers/ProjectWrapper";
import { LayoutBlock } from "@components/LayoutBlock";

export const ProjectUploadsPage: NextPageExtended<
  {},
  {},
  ProjectPageWrapperProps
> = () => {
  const project = useProjectContext();
  return <LayoutBlock>uploads...</LayoutBlock>;
};

ProjectUploadsPage.type = "app";
ProjectUploadsPage.navId = "project";
ProjectUploadsPage.Wrapper = ProjectPageWrapper;
ProjectUploadsPage.wrapperProps = {
  tabId: "uploads",
};

export default ProjectUploadsPage;
