import type { FC } from "react";
import type { GithubFile } from "@assetier/types";

export interface AssetCardProps {
  asset: GithubFile;
  onClick?: (asset: GithubFile) => void;
}

export const AssetCard: FC<AssetCardProps> = ({ asset, onClick }) => {
  return (
    <div className="flex">
      <button
        className="group flex max-w-full flex-grow flex-col items-center justify-center"
        onClick={() => onClick && onClick(asset)}
      >
        <div className="flex h-28 w-full flex-grow flex-col items-center justify-center overflow-hidden rounded-md bg-gray-100 p-2 outline-2 outline-offset-2 outline-zinc-500 group-hover:outline">
          <img
            className="h-[28px] w-[28px]"
            src={`${asset.download_url}?nocache=${Date.now()}`}
            alt={asset.name}
          />
        </div>
        <div className="max-w-full overflow-hidden p-2">
          <p className="truncate font-mono text-[10px]">{asset.name}</p>
        </div>
      </button>
    </div>
  );
};
