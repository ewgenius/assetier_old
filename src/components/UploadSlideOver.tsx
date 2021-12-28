import { FC, useCallback } from "react";
import type { Project } from "@prisma/client";

import { Spinner } from "@components/Spinner";
import {
  SlideOver,
  SlideOverProps,
  SlideOverHeading,
  SlideOverFooter,
  SlideOverBody,
} from "@components/SlideOver";
import { TextInput } from "@components/TextInput";
import { Toggle } from "@components/Toggle";
import { useProjectUpdater } from "@hooks/useProjectUpdater";

export interface UploadSlideOverProps extends SlideOverProps {
  project: Project;
}

export const UploadSlideOver: FC<UploadSlideOverProps> = ({
  open,
  onClose,
  project,
}) => {
  return (
    <SlideOver open={open} onClose={onClose} size="2xl">
      <SlideOverHeading onClose={onClose} title="Upload assets" />

      <SlideOverBody></SlideOverBody>

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
          // disabled={updating || !form.isValid}
          className="ml-4 inline-flex items-center disabled:opacity-50 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        >
          <span>Upload</span>
          {/* {updating && <Spinner className="ml-2" />} */}
        </button>
      </SlideOverFooter>
    </SlideOver>
  );
};
