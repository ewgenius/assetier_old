import { GithubFile } from "@utils/types";
import { FC } from "react";
import { LayoutBlock } from "./LayoutBlock";
import { Spinner } from "./Spinner";

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
              <div key={asset.name} className="flex">
                <button
                  className="max-w-full flex flex-col flex-grow justify-center items-center group"
                  onClick={() => onClick && onClick(asset)}
                >
                  <div className="h-28 w-full p-2 overflow-hidden flex flex-col flex-grow justify-center items-center rounded-md bg-white group-hover:outline outline-offset-2 outline-2 outline-zinc-500">
                    <img
                      className="w-[32px] h-[32px]"
                      src={asset.download_url}
                    />
                  </div>
                  <div className="p-2 overflow-hidden max-w-full">
                    <p className="font-mono text-[10px] truncate">
                      {asset.name}
                    </p>
                  </div>
                </button>
              </div>
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
