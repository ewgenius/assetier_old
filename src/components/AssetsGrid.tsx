import { GithubFile } from "@utils/types";
import { FC } from "react";
import { LayoutBlock } from "./LayoutBlock";
import { Spinner } from "./Spinner";

export interface AssetsGridProps {
  assets?: GithubFile[];
}

export const AssetsGrid: FC<AssetsGridProps> = ({ assets }) => {
  return (
    <LayoutBlock>
      {assets && assets.length ? (
        <div className="flex flex-col">
          <div className="grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-2">
            {assets.map((asset) => (
              <div key={asset.name} className="flex">
                <a
                  className="h-28 flex flex-col flex-grow justify-center items-center p-2 rounded-md bg-white hover:outline outline-offset-2 outline-2 outline-zinc-500"
                  href={asset._links.html}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="w-[24px] h-[24px] mb-2"
                    src={asset.download_url}
                  />
                  <p className="font-mono text-xs">{asset.name}</p>
                </a>
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
