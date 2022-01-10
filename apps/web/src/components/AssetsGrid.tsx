import type { GithubFile } from "@assetier/types";
import type { FC } from "react";
import { AssetCard } from "@components/AssetCard";
import { LayoutBlock } from "@components/LayoutBlock";
import { Spinner } from "@components/Spinner";

export interface AssetsGridProps {
  assets?: GithubFile[];
  onClick?: (asset: GithubFile) => void;
}

export const AssetsGrid: FC<AssetsGridProps> = ({ assets, onClick }) => {
  return (
    <LayoutBlock>
      {assets && assets.length ? (
        <div className="flex flex-col">
          <div className="grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-2">
            {assets.map((asset) => (
              <AssetCard key={asset.name} asset={asset} onClick={onClick} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </LayoutBlock>
  );
};
