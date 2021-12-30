import { FC, Fragment, ReactNode } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { classNames } from "@utils/classNames";
import { Spinner } from "@components/Spinner";

export interface SelectProps<T = any> {
  label?: string;
  items?: T[];
  selectedItem: T | null;
  onChange: (item: T | null) => void;
  renderButton: (item: T | null) => ReactNode;
  getItemId: (item: T) => string;
  renderBefore?: () => ReactNode;
  renderItem: (
    item: T,
    options: { selected?: boolean; active?: boolean }
  ) => ReactNode;
}

export const Select: FC<SelectProps> = ({
  label,
  items,
  selectedItem,
  onChange,
  renderButton,
  getItemId,
  renderBefore,
  renderItem,
}) => {
  return (
    <Listbox value={selectedItem} onChange={onChange}>
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="block text-sm font-medium text-gray-700">
              {label}
            </Listbox.Label>
          )}
          <div className="mt-1 relative">
            <Listbox.Button className="bg-white cursor-pointer relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm">
              {renderButton(selectedItem)}
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                {items ? (
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <Spinner />
                )}
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {renderBefore && renderBefore()}

                {items ? (
                  items.map((item) => (
                    <Listbox.Option
                      key={getItemId(item)}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-zinc-600" : "text-gray-900",
                          "cursor-pointer select-none relative py-2 pl-3 pr-9"
                        )
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          {renderItem(item, { selected, active })}

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-zinc-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))
                ) : (
                  <div className="flex pt-3 pb-4 justify-center">
                    <Spinner />
                  </div>
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};