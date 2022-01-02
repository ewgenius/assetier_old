import type { FC } from "react";
import { useCallback } from "react";

import { Spinner } from "@components/Spinner";
import type { SlideOverProps } from "@components/SlideOver";
import {
  SlideOver,
  SlideOverHeading,
  SlideOverFooter,
  SlideOverBody,
} from "@components/SlideOver";
import { TextInput } from "@components/TextInput";

import { useOrganizationCreator } from "@hooks/useOrganizationCreator";

export const NewOrganizationSlideOver: FC<SlideOverProps> = ({
  open,
  onClose,
}) => {
  const { name, setNameHandler, creating, createOrganization } =
    useOrganizationCreator();

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const submit = useCallback(() => {
    createOrganization().then(close);
  }, [createOrganization, close]);

  return (
    <SlideOver open={open} onClose={close} onSubmit={submit}>
      <SlideOverHeading onClose={close} title="New Organization" />

      <SlideOverBody>
        <TextInput
          id="organization-name"
          name="organization-name"
          label="Organization name"
          placeholder="My Team"
          disabled={creating}
          value={name}
          onChange={setNameHandler}
        />
      </SlideOverBody>

      <SlideOverFooter>
        <button
          type="button"
          className="bg-white py-2 px-4 border disabled:opacity-50 border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          disabled={creating}
          onClick={close}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={creating}
          className="ml-4 inline-flex items-center disabled:opacity-50 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        >
          <span>Create</span>
          {creating && <Spinner className="ml-2" />}
        </button>
      </SlideOverFooter>
    </SlideOver>
  );
};
