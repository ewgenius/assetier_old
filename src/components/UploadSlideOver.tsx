import { FC, useCallback, useState } from "react";
import type { Project } from "@prisma/client";
import { useDropzone } from "react-dropzone";
import { XIcon } from "@heroicons/react/outline";

import {
  SlideOver,
  SlideOverProps,
  SlideOverHeading,
  SlideOverFooter,
  SlideOverBody,
} from "@components/SlideOver";

export interface UploadSlideOverProps extends SlideOverProps {
  project: Project;
}

export const UploadSlideOver: FC<UploadSlideOverProps> = ({
  open,
  onClose,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const deleteFile = useCallback(
    (index: number) => {
      setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
    },
    [files]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const length = Object.keys(files).length;
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <SlideOver open={open} onClose={onClose} size="2xl">
      <SlideOverHeading onClose={onClose} title="Upload assets" />

      <SlideOverBody>
        <div>
          <h2 className="font-medium mb-2">
            {files?.length > 0
              ? `${files.length} files selected for upload:`
              : "Select files for upload"}
          </h2>

          <div
            className="p-2 min-h-0 max-h-80 overflow-y-auto rounded-md bg-gray-100 border border-zinc-200"
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            <div className="mb-2 last:mb-0 border-2 border-dotted border-gray-300 hover:border-gray-400 py-2 px-4 rounded-md cursor-pointer">
              {isDragActive ? (
                <div className="text-zinc-400">Drop the files here ...</div>
              ) : (
                <div className="text-zinc-4 00">
                  Drag 'n' drop some files here, or click to select files
                </div>
              )}
            </div>

            {files && files.length > 0 && (
              <div className="flex flex-grow flex-col gap-2">
                {files.map((file, i) => {
                  return (
                    <div
                      className="flex box-border p-2 bg-white rounded-md justify-center items-center"
                      key={`file-${i}`}
                    >
                      <div className="flex-shrink-0 rounded-lg p-2 border border-gray-100">
                        <img
                          key={file.name}
                          className="w-4 h-4"
                          src={URL.createObjectURL(file)}
                        />
                      </div>

                      <div className="flex-grow flex flex-col justify-center px-4">
                        <p className="text-xs text-mono text-gray-700">
                          {file.name}
                        </p>
                        <p className="text-xs text-mono text-gray-400">
                          {file.size}B
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteFile(i);
                          return false;
                        }}
                        className="hover:text-zinc-500 text-zinc-400 p-2"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </SlideOverBody>

      <SlideOverFooter>
        <button
          type="button"
          className="bg-white py-2 px-4 border disabled:opacity-50 border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          // disabled={updating}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!files?.length}
          className="ml-4 inline-flex items-center disabled:opacity-50 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        >
          <span>Upload</span>
          {/* {updating && <Spinner className="ml-2" />} */}
        </button>
      </SlideOverFooter>
    </SlideOver>
  );
};
