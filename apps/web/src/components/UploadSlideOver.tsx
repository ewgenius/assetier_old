import type { FC } from "react";
import { useCallback, useState } from "react";
import type { Project } from "@assetier/prisma";
import { useDropzone } from "react-dropzone";
import { XIcon } from "@heroicons/react/outline";

import type { SlideOverProps } from "@components/SlideOver";
import {
  SlideOver,
  SlideOverHeading,
  SlideOverFooter,
  SlideOverBody,
} from "@components/SlideOver";
import { Spinner } from "./Spinner";
import { useProjectContents } from "@hooks/useProjectContents";
import { Toggle } from "@components/Toggle";
import type { GithubBranch } from "@assetier/types";

export interface UploadSlideOverProps extends SlideOverProps {
  project: Project;
  baseBranch?: GithubBranch | null;
}

export const UploadSlideOver: FC<UploadSlideOverProps> = ({
  open,
  onClose,
  project,
  baseBranch,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [merge, setMerge] = useState(false);

  const { refresh } = useProjectContents(
    project.id,
    baseBranch?.name || project.defaultBranch
  );
  const [uploading, setUploading] = useState(false);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => setFiles([...files, ...acceptedFiles]),
    [files]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const deleteFile = useCallback(
    (index: number) =>
      setFiles([...files.slice(0, index), ...files.slice(index + 1)]),
    [files]
  );

  const close = useCallback(() => {
    setFiles([]);
    setUploading(false);
    setMerge(false);
    onClose();
  }, [setFiles, setUploading, setMerge, onClose]);

  const submit = useCallback(() => {
    setUploading(true);
    const data = new FormData();
    files.forEach((file, i) => {
      data.set(`${file.name}_${i}`, file);
    });

    if (baseBranch) {
      data.set("baseBranch", baseBranch.name);
    }

    data.set("merge", merge ? "true" : "false");

    fetch(
      `/api/organizations/${project.organizationId}/projects/${project.id}/upload`,
      {
        method: "POST",
        body: data,
      }
    )
      .then(refresh)
      .finally(close);
  }, [files, merge, project, baseBranch, close, refresh]);

  return (
    <SlideOver open={open} onClose={onClose} onSubmit={submit} size="xl">
      <SlideOverHeading
        onClose={onClose}
        title="Upload assets"
        subtitle={baseBranch?.name}
      />

      <SlideOverBody>
        <div>
          <h2 className="mb-2 font-medium">
            {files?.length > 0
              ? `${files.length} files selected for upload:`
              : "Select files for upload"}
          </h2>

          <div
            className="max-h-80 min-h-0 overflow-y-auto rounded-md border border-zinc-200 bg-gray-100 p-2"
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            <div className="mb-2 cursor-pointer rounded-md border-2 border-dotted border-gray-300 py-2 px-4 last:mb-0 hover:border-gray-400">
              {isDragActive ? (
                <div className="text-zinc-400">Drop the files here ...</div>
              ) : (
                <div className="text-zinc-400">
                  Drag &apos;n&apos; drop some files here, or click to select
                  files
                </div>
              )}
            </div>

            {files && files.length > 0 && (
              <div className="flex flex-grow flex-col gap-2">
                {files.map((file, i) => {
                  return (
                    <div
                      className="box-border flex items-center justify-center rounded-md bg-white p-2"
                      key={`file-${i}`}
                    >
                      <div className="flex-shrink-0 rounded-lg border border-gray-100 p-2">
                        <img
                          key={file.name}
                          className="h-4 w-4"
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                        />
                      </div>

                      <div className="flex flex-grow flex-col justify-center px-4">
                        <p className="text-mono text-xs text-gray-700">
                          {file.name}
                        </p>
                        <p className="text-mono text-xs text-gray-400">
                          {file.size}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteFile(i);
                          return false;
                        }}
                        className="p-2 text-zinc-400 hover:text-zinc-500"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Toggle
          label="Merge Pull Request instantly?"
          checked={merge}
          onChange={setMerge}
        />
      </SlideOverBody>

      <SlideOverFooter>
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={uploading}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading || !files?.length}
          className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <span>Upload</span>
          {uploading && <Spinner className="ml-2" />}
        </button>
      </SlideOverFooter>
    </SlideOver>
  );
};
