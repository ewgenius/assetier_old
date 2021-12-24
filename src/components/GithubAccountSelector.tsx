import { FC, Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { classNames } from "@utils/classNames";
import { useAppContext } from "@hooks/useAppContext";
import { useGithubAccounts } from "@hooks/useGithubAccounts";
import { Spinner } from "./Spinner";
import { GithubInstallation } from "@prisma/client";
import { PlusCircleIcon, ViewGridAddIcon } from "@heroicons/react/outline";

const people = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
  { id: 7, name: "Caroline Schultz" },
  { id: 8, name: "Mason Heaney" },
  { id: 9, name: "Claudie Smitham" },
  { id: 10, name: "Emil Schaefer" },
];

interface GithubAccountSelectorProps {}

export const GithubAccountSelector: FC<GithubAccountSelectorProps> = ({}) => {
  const { organization } = useAppContext();
  const { accounts } = useGithubAccounts(organization.id);
  const [selected, setSelected] = useState<GithubInstallation | null>(null);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            GitHub Account
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="bg-white cursor-pointer relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm">
              {selected ? (
                <span className="flex items-center">
                  <img
                    src={selected.accountAvatarUrl}
                    alt=""
                    className="flex-shrink-0 h-6 w-6 rounded-full"
                  />
                  <span className="ml-3 block truncate">
                    {selected.accountLogin}
                  </span>
                </span>
              ) : (
                <span>Select GitHub Account</span>
              )}

              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
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
                <li>
                  <button
                    type="button"
                    className="w-full text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:text-white hover:bg-zinc-600"
                    onClick={() => {
                      const state = organization.id;
                      window.open(
                        `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new?state=${state}`,
                        "winname",
                        "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800,height=600"
                      );
                    }}
                  >
                    <div className="flex items-center">
                      <PlusCircleIcon className="flex-shrink-0 h-6 w-6" />
                      <span
                        className={classNames(
                          selected ? "font-semibold" : "font-normal",
                          "ml-3 block truncate"
                        )}
                      >
                        Add GitHub Account
                      </span>
                    </div>
                  </button>
                  <div className="w-full px-2 py-1">
                    <div className="border-b border-gray-100" />
                  </div>
                </li>

                {accounts ? (
                  accounts.map((account) => (
                    <Listbox.Option
                      key={account.id}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-zinc-600" : "text-gray-900",
                          "cursor-pointer select-none relative py-2 pl-3 pr-9"
                        )
                      }
                      value={account}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <img
                              src={account.accountAvatarUrl}
                              alt=""
                              className="flex-shrink-0 h-6 w-6 rounded-full"
                            />
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {account.accountLogin}
                            </span>
                          </div>

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
