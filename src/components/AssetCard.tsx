import type { FC } from "react";
import type { GithubFile } from "@utils/types";

export interface AssetCardProps {
  asset: GithubFile;
  onClick?: (asset: GithubFile) => void;
}

export const AssetCard: FC<AssetCardProps> = ({ asset, onClick }) => {
  return (
    <div className="flex">
      <button
        className="max-w-full flex flex-col flex-grow justify-center items-center group"
        onClick={() => onClick && onClick(asset)}
      >
        <div className="h-28 w-full p-2 overflow-hidden flex flex-col flex-grow justify-center items-center rounded-md bg-white group-hover:outline outline-offset-2 outline-2 outline-zinc-500">
          <img
            className="w-[32px] h-[32px]"
            src={asset.download_url}
            alt={asset.name}
          />
        </div>
        <div className="p-2 overflow-hidden max-w-full">
          <p className="font-mono text-[10px] truncate">{asset.name}</p>
        </div>
      </button>
    </div>
  );
};
