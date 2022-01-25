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
import { useOrganization } from "@hooks/useOrganization";

export const NewOrganizationSlideOver: FC<SlideOverProps> = ({
  open,
  onClose,
}) => {
  const { setOrganization } = useOrganization();
  const { name, setNameHandler, creating, createOrganization } =
    useOrganizationCreator();

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const submit = useCallback(() => {
    createOrganization().then((org) => {
      setOrganization(org);
      close();
    });
  }, [createOrganization, close, setOrganization]);

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
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={creating}
          onClick={close}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={creating}
          className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <span>Create</span>
          {creating && <Spinner className="ml-2" />}
        </button>
      </SlideOverFooter>
    </SlideOver>
  );
};
