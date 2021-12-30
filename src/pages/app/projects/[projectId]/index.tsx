import { GithubBranch, GithubFile, NextPageExtended } from "@utils/types";
import { AssetsGrid } from "@components/AssetsGrid";
import {
  ProjectPageWrapper,
  ProjectPageWrapperProps,
  useProjectContext,
} from "@components/PageWrappers/ProjectWrapper";
import { UploadSlideOver } from "@components/UploadSlideOver";
import { AssetDetailsSlideOver } from "@components/AssetDetailsSlideOver";
import { useState } from "react";
import { useProjectContents } from "@hooks/useProjectContents";
import { useDelayedInputState } from "@hooks/useInputState";
import { AssetsToolbar } from "@components/AssetsToolbar";

export const ProjectPage: NextPageExtended<{}, {}, ProjectPageWrapperProps> =
  () => {
    const project = useProjectContext();
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<GithubBranch | null>(
      null
    );
    const { contents } = useProjectContents(
      project.id,
      selectedBranch?.name || project.defaultBranch
    );
    const [selectedAsset, setSelectedAsset] = useState<GithubFile | null>(null);
    const [query, delayedQuery, setQuery, delaying] = useDelayedInputState();

    return (
      <>
        <AssetsToolbar
          project={project}
          query={query}
          onQueryChange={setQuery}
          querying={delaying}
          onUploadClick={() => setUploadOpen(true)}
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
        />
        <AssetsGrid
          assets={contents?.filter(
            (asset) => asset.download_url && asset.name.includes(delayedQuery)
          )}
          onClick={setSelectedAsset}
        />
        <UploadSlideOver
          project={project}
          baseBranch={selectedBranch}
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
        />
        <AssetDetailsSlideOver
          project={project}
          asset={selectedAsset}
          open={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      </>
    );
  };

ProjectPage.type = "app";
ProjectPage.navId = "project";
ProjectPage.Wrapper = ProjectPageWrapper;
ProjectPage.wrapperProps = {
  tabId: "index",
};

export default ProjectPage;
