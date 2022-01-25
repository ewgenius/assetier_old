import { useMemo } from "react";
import type { FC } from "react";
import type { Project } from "@assetier/prisma";

import type { SlideOverProps } from "@components/SlideOver";
import {
  SlideOver,
  SlideOverHeading,
  SlideOverBody,
} from "@components/SlideOver";
import type { GithubFile } from "@assetier/types";
import { useAssetCommits } from "@hooks/useAssetCommits";
import { Spinner } from "./Spinner";

export interface AssetDetailsSlideOverProps extends SlideOverProps {
  project: Project;
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
  const { commits } = useAssetCommits(project.id, asset?.path);

  const getAssetUrlForCommit = useMemo(() => {
    const groups = asset?.download_url.match(
      new RegExp(
        `(https:\/\/raw\.githubusercontent\.com\/(.+)\/(.+))\/(.+)\/(${project.assetsPath}\/(.+))`
      )
    );
    if (groups && groups.length === 7) {
      console.log(groups);
      return (commit: string) => `${groups[1]}/${commit}/${groups[5]}`;
    }
    return (commit: string) => "";
  }, [asset?.download_url]);

  return (
    <SlideOver open={open} onClose={close} size="xl">
      {asset && (
        <>
          <SlideOverHeading onClose={close} title="Asset details" />

          <SlideOverBody>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="align-center flex flex-shrink-0 justify-center">
                <div className="rounded-md border border-gray-200 p-4">
                  <img
                    src={asset.download_url}
                    className="h-16 w-16"
                    alt={asset.name}
                  />
                </div>
              </div>
              <div className="flex flex-grow flex-col space-y-2 font-mono text-xs">
                <p>name: {asset.name}</p>
                <p>path: {asset.path}</p>
                <p>size: {asset.size}B</p>
                <p>
                  <a
                    className="cursor-pointer underline hover:no-underline"
                    href={asset._links.html}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub link
                  </a>
                </p>
              </div>
            </div>

            <div className="my-4 border-b border-gray-200" />

            <div>
              {commits ? (
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {commits.map((commit, i) => (
                      <li key={commit.sha}>
                        <div className="relative pb-8">
                          {i !== commits.length - 1 ? (
                            <span
                              className="absolute top-3 left-3 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div className="">
                              <img
                                src={commit.author?.avatar_url}
                                className="h-6 w-6 rounded-full border border-gray-200"
                                alt={commit.author?.login}
                              />
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4">
                              <div>
                                <p className="text-sm">
                                  {commit.commit.author?.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {commit.commit.message}
                                </p>
                                <p className="text-xs text-gray-500">
                                  <time dateTime={commit.commit.author?.date}>
                                    {commit.commit.author?.date}
                                  </time>
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <div className="rounded-md border border-gray-200 p-4">
                                  <img
                                    src={getAssetUrlForCommit(commit.sha)}
                                    className=" h-8 w-8"
                                    onError={({ currentTarget }) => {
                                      currentTarget.onerror = null;
                                      currentTarget.src =
                                        location.origin + "/none.png";
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              )}
            </div>
          </SlideOverBody>

          {/* <SlideOverFooter></SlideOverFooter> */}
        </>
      )}
    </SlideOver>
  );
};
