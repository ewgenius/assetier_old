import type { FC, ReactNode } from "react";
import { Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { classNames } from "@utils/classNames";
import { Spinner } from "@components/Spinner";
import { XCircleIcon } from "@heroicons/react/outline";

export interface SelectProps<T = any> {
  label?: string;
  placeholder?: string;
  renderPlaceholder?: () => ReactNode;
  disabled?: boolean;
  items?: T[];
  selectedItem: T | null;
  onChange: (item: T | null) => void;
  renderButton: (item: T) => ReactNode;
  preselectedId?: string;
  getItemId: (item: T) => string;
  renderBefore?: () => ReactNode;
  renderItem: (
    item: T,
    options: { selected?: boolean; active?: boolean }
  ) => ReactNode;
  onDelete?: (item: T) => void;
  isItemDisabled?: (item: T) => boolean;
}

export const Select: FC<SelectProps> = ({
  label,
  disabled,
  placeholder,
  renderPlaceholder,
  items,
  selectedItem,
  onChange,
  renderButton,
  preselectedId,
  getItemId,
  renderBefore,
  renderItem,
  isItemDisabled,
  onDelete,
}) => {
  useEffect(() => {
    if (items && items.length > 0 && !selectedItem && preselectedId) {
      const item = items.find((i) => getItemId(i) === preselectedId);
      if (item) {
        onChange(item);
      }
    }
  }, [items, preselectedId, selectedItem, getItemId, onChange]);

  return (
    <Listbox value={selectedItem} onChange={onChange} disabled={disabled}>
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="mb-1 block text-sm font-medium text-gray-700">
              {label}
            </Listbox.Label>
          )}
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm">
              {selectedItem ? (
                renderButton(selectedItem)
              ) : renderPlaceholder ? (
                renderPlaceholder()
              ) : (
                <span className="block truncate text-gray-500">
                  {placeholder}
                </span>
              )}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
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
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {renderBefore && renderBefore()}

                {items ? (
                  items.map((item) => (
                    <Listbox.Option
                      key={getItemId(item)}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-zinc-100" : "",
                          "relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900"
                        )
                      }
                      value={item}
                      disabled={isItemDisabled && isItemDisabled(item)}
                    >
                      {({ selected, active }) => (
                        <>
                          {renderItem(item, { selected, active })}

                          {selected ? (
                            <span
                              className={classNames(
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : onDelete ? (
                            <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center p-2">
                              <button
                                className="rounded-md px-2 py-1.5 hover:bg-gray-200"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  onDelete(item);

                                  return false;
                                }}
                              >
                                <XCircleIcon className="h-6 w-5" />
                              </button>
                            </div>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))
                ) : (
                  <div className="flex justify-center pt-3 pb-4">
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
