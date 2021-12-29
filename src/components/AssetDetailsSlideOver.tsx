import { FC } from "react";
import type { Project } from "@prisma/client";

import {
  SlideOver,
  SlideOverProps,
  SlideOverHeading,
  SlideOverFooter,
  SlideOverBody,
} from "@components/SlideOver";
import type { GithubFile } from "@utils/types";

export interface AssetDetailsSlideOverProps extends SlideOverProps {
  project: Partial<Project>;
  asset?: GithubFile | null;
}

export const AssetDetailsSlideOver: FC<AssetDetailsSlideOverProps> = ({
  open,
  onClose,
  project,
  asset,
}) => {
  const close = () => {
    onClose();
  };

  return (
    <SlideOver open={open} onClose={close} size="xl">
      {asset && (
        <>
          <SlideOverHeading onClose={close} title="Asset details" />

          <SlideOverBody>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0 flex justify-center align-center">
                <div className="p-4 border border-gray-200 rounded-md">
                  <img src={asset.download_url} className="w-16 h-16" />
                </div>
              </div>
              <div className="flex-grow flex flex-col text-xs font-mono space-y-2">
                <p>name: {asset.name}</p>
                <p>path: {asset.path}</p>
                <p>size: {asset.size}B</p>
              </div>
            </div>
          </SlideOverBody>

          {/* <SlideOverFooter></SlideOverFooter> */}
        </>
      )}
    </SlideOver>
  );
};
