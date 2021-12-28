import type { NextPageExtended } from "@utils/types";
import { AssetsGrid } from "@components/AssetsGrid";
import {
  ProjectPageWrapper,
  ProjectPageWrapperProps,
  useProjectContext,
} from "@components/PageWrappers/ProjectWrapper";

export const ProjectPage: NextPageExtended<{}, {}, ProjectPageWrapperProps> =
  () => {
    const project = useProjectContext();
    return <AssetsGrid project={project} />;
  };

ProjectPage.type = "app";
ProjectPage.navId = "project";
ProjectPage.Wrapper = ProjectPageWrapper;
ProjectPage.wrapperProps = {
  tabId: "index",
};

export default ProjectPage;
