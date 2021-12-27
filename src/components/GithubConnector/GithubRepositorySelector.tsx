import { FC, Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import type { Project } from "@prisma/client";

import { classNames } from "@utils/classNames";
import {
  Repository,
  useGithubAccountRepositories,
} from "@hooks/useGithubAccountRepositories";
import { useAppContext } from "@hooks/useAppContext";
import { Spinner } from "../Spinner";

export interface GithubRepositorySelectorProps {
  installationId: number;
  value?: number | null;
  onChange?: (repositoryId: number | null) => void;
}

export const GithubRepositorySelector: FC<GithubRepositorySelectorProps> = ({
  installationId,
  value,
  onChange,
}) => {
  const { organization } = useAppContext();
  const [selected, setSelected] = useState<Repository | null>(null);
  const { repositories } = useGithubAccountRepositories(
    organization.id,
    installationId
  );

  useEffect(() => {
    select(null);
  }, [installationId]);

  useEffect(() => {
    if (repositories && value) {
      const repository = repositories.find((r) => r.id === value);
      repository && select(repository);
    }
  }, [repositories, value]);

  const select = (repository: Repository | null) => {
    setSelected(repository);
    if (onChange) {
      onChange(repository ? repository.id : null);
    }
  };

  return (
    <Listbox value={selected} onChange={select}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            Repository
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm">
              {selected ? (
                <span className="block truncate">
                  @{selected.owner.login}/{selected.name}
                </span>
              ) : (
                <span className="block truncate text-gray-500">
                  Select Repository
                </span>
              )}
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                {repositories ? (
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
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-40 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {repositories ? (
                  repositories.map((repository) => (
                    <Listbox.Option
                      key={repository.id}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-zinc-600" : "text-gray-900",
                          "cursor-pointer select-none relative py-2 pl-3 pr-9"
                        )
                      }
                      value={repository}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            @{repository.owner.login}/{repository.name}
                          </span>

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
                  <div className="flex py-3 justify-center">
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
