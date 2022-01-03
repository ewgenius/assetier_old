import { useCallback } from "react";
import type { FC } from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/outline";

import type { OrganizationWithPlan } from "@utils/types";
import { classNames } from "@utils/classNames";
import { useMe } from "@hooks/useMe";
import { OrganizationType } from "@prisma/client";
import { useOrganization } from "@hooks/useOrganization";

export interface OrganizationDropdownProps {
  onCreateOrganizationClick: () => void;
  onSelectOrganization?: () => void;
}

export const OrganizationDropdown: FC<OrganizationDropdownProps> = ({
  onCreateOrganizationClick,
  onSelectOrganization,
}) => {
  const { user } = useMe();
  const { organization: currentOrganization, setOrganization } =
    useOrganization();

  const selectOrganization = useCallback(
    (organization: OrganizationWithPlan) => {
      setOrganization(organization);
      if (onSelectOrganization) {
        onSelectOrganization();
      }
    },
    [onSelectOrganization, setOrganization]
  );

  if (!user) {
    return null;
  }

  return (
    <Menu as="div" className="mx-2 relative sm:w-auto">
      <div className="flex">
        <Menu.Button className="sm:max-w-xs flex flex-grow items-center text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
          <div className="flex flex-grow mx-2">
            <div className="font-medium text-lg sm:text-sm text-gray-800 mr-1">
              {currentOrganization.type === OrganizationType.PERSONAL
                ? user.user.name
                : currentOrganization.name}
            </div>
            <div>
              <div className="text-xs font-medium bg-zinc-600 text-white px-2 rounded-lg">
                {currentOrganization.organizationPlan.name}
              </div>
            </div>
          </div>
          <span className="sr-only">Open organization menu</span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-full sm:w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item key={user.personalOrganization.id}>
            {({ active }) => (
              <button
                onClick={() => selectOrganization(user.personalOrganization)}
                className={classNames(
                  active ||
                    currentOrganization.id === user.personalOrganization.id
                    ? "bg-gray-100"
                    : "",
                  "flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 text-left"
                )}
              >
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xs">{user.user.name}</span>
                  <span className="text-sm sm:text-xs text-gray-400">
                    personal
                  </span>
                </div>
              </button>
            )}
          </Menu.Item>

          <div className="border-b border-gray-200 my-1 mx-2" />

          {user.organizations
            .filter((org) => org.type !== OrganizationType.PERSONAL)
            .map((organization) => (
              <Menu.Item key={organization.id}>
                {({ active }) => (
                  <button
                    onClick={() => selectOrganization(organization)}
                    className={classNames(
                      active || currentOrganization.id === organization.id
                        ? "bg-gray-100"
                        : "",
                      "flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 text-left"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-lg sm:text-xs">
                        {organization.type === OrganizationType.PERSONAL
                          ? user.user.name
                          : organization.name}
                      </span>
                      <span className="text-sm sm:text-xs text-gray-400">
                        {organization.type === OrganizationType.PERSONAL
                          ? "personal"
                          : "team"}
                      </span>
                    </div>
                  </button>
                )}
              </Menu.Item>
            ))}

          <Menu.Item>
            <button
              onClick={() => onCreateOrganizationClick()}
              className="flex items-center justify-between w-full px-4 py-2 text-lg sm:text-sm text-gray-700 text-left hover:bg-gray-100"
            >
              <span>Create New Org</span>
              <PlusCircleIcon className="sm:w-4 sm:h-4 w-6 h-6" />
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
