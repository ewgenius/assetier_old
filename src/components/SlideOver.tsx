import { FC, Fragment, PropsWithChildren } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

export interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export const SlideOver: FC<PropsWithChildren<SlideOverProps>> = ({
  open,
  onClose,
  onSubmit,
  children,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={onClose}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            className="absolute inset-0 bg-black"
            as={Dialog.Overlay}
            enter="opacity ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-25"
            entered="opacity-25"
            leave="opacity transition ease-in-out duration-500"
            leaveFrom="opacity-25"
            leaveTo="opacity-0"
          />

          <div className="fixed inset-y-0 pl-16 max-w-full right-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit && onSubmit();
                    return false;
                  }}
                  className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
                >
                  {children}
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export interface SlideOverHeadingProps extends Pick<SlideOverProps, "onClose"> {
  title: string;
  subtitle?: string;
}

export const SlideOverHeading: FC<SlideOverHeadingProps> = ({
  title,
  subtitle,
  onClose,
}) => {
  return (
    <div className="py-6 px-4 bg-zinc-700 sm:px-6">
      <div className="flex items-center justify-between">
        <Dialog.Title className="text-lg font-medium text-white">
          {title}
        </Dialog.Title>
        <div className="ml-3 h-7 flex items-center">
          <button
            type="button"
            className="bg-zinc-700 rounded-md text-zinc-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Close panel</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      {subtitle && (
        <div className="mt-1">
          <p className="text-sm text-zinc-300">subtitle</p>
        </div>
      )}
    </div>
  );
};
