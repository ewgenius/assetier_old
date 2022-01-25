import type { FC, PropsWithChildren } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { classNames } from "@utils/classNames";

export interface SlideOverProps {
  open: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  onClose: () => void;
  onSubmit?: () => void;
}

export const SlideOver: FC<PropsWithChildren<SlideOverProps>> = ({
  open,
  onClose,
  onSubmit,
  children,
  size,
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

          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div
                className={classNames(
                  "h-screen w-screen p-2",
                  size === "sm" && "max-w-sm",
                  size === "md" && "max-w-md",
                  size === "lg" && "max-w-lg",
                  size === "xl" && "max-w-xl",
                  size === "2xl" && "max-w-2xl"
                  // `max-w-${size}`
                )}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit && onSubmit();
                    return false;
                  }}
                  className="box-border flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-xl"
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

SlideOver.defaultProps = {
  size: "md",
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
    <div className="rounded-t-lg border-b border-gray-200 py-6 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <Dialog.Title className="text-lg font-medium text-gray-900">
          {title}
        </Dialog.Title>
        <div className="ml-3 flex h-7 items-center">
          <button
            type="button"
            className="rounded-md text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <span className="sr-only">Close panel</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      {subtitle && (
        <div className="mt-1">
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      )}
      {/* <div className="mt-6 flex-grow " /> */}
    </div>
  );
};

export const SlideOverFooter: FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="flex flex-shrink-0 justify-end border-t border-gray-200 px-4 py-4">
    {children}
  </div>
);

export const SlideOverBody: FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="flex h-0 flex-1 flex-col overflow-y-auto">
    <div className="flex flex-1 flex-grow flex-col justify-between">
      <div className="flex flex-1 flex-grow flex-col px-4 sm:px-6">
        <div className="flex flex-1 flex-grow flex-col space-y-6 pt-6 pb-5">
          {children}
        </div>
      </div>
    </div>
  </div>
);
