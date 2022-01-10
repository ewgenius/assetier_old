import { useCallback } from "react";
import type { FC } from "react";
import { Fragment } from "react";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import {
  CogIcon,
  PlusCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";

import type { OrganizationWithPlan } from "lib-types";
import { classNames } from "@utils/classNames";
import { useMe } from "@hooks/useMe";
import { OrganizationType } from "lib-prisma";
import { useOrganization } from "@hooks/useOrganization";

export interface OrganizationMenuItemProps {
  organization: OrganizationWithPlan;
  onClick?: (organization: OrganizationWithPlan) => void;
  active?: boolean;
}

export const OrganizationMenuItem: FC<OrganizationMenuItemProps> = ({
  organization,
  onClick,
  active,
}) => {
  const { user } = useMe();

  return (
    <button
      onClick={onClick && (() => onClick(organization))}
      className={classNames(
        active ? "bg-gray-100" : "",
        !!onClick ? "cursor-pointer hover:bg-gray-100" : "cursor-default",
        "flex items-center w-full px-4 py-2 text-sm text-gray-700 text-left"
      )}
    >
      <div className="bg-zinc-200 rounded-lg p-2 sm:p-1 mr-2 -ml-1">
        {organization.type === OrganizationType.PERSONAL ? (
          <UserIcon className="w-4 h-4" />
        ) : (
          <UserGroupIcon className="w-4 h-4" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-md sm:text-xs">
          {organization.type === OrganizationType.PERSONAL
            ? user?.user.name
            : organization.name}
        </span>
        <span className="text-sm sm:text-xs text-gray-400">
          {organization.type === OrganizationType.PERSONAL
            ? "personal"
            : "team"}
        </span>
      </div>
    </button>
  );
};

export interface OrganizationDropdownProps {
  onCreateOrganizationClick: () => void;
  onSelectOrganization?: () => void;
}

export const OrganizationDropdown: FC<OrganizationDropdownProps> = ({
  onCreateOrganizationClick,
  onSelectOrganization,
}) => {
  const { push } = useRouter();
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
    <Menu as="div" className="relative sm:w-auto">
      <div className="flex">
        <Menu.Button className="sm:max-w-xs flex flex-grow items-center py-2 px-2 hover:bg-gray-300 sm:h-8 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
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
        <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-full sm:w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <OrganizationMenuItem organization={currentOrganization} />

          <Menu.Item key="organization-settings">
            <button
              onClick={() => push(`/app/${currentOrganization.id}/settings`)}
              className="flex items-center w-full px-4 py-2 text-md sm:text-sm text-gray-700 text-left hover:bg-gray-100"
            >
              <CogIcon className="sm:w-4 sm:h-4 w-6 h-6 mr-3" />
              <span>Settings</span>
            </button>
          </Menu.Item>

          <Menu.Item key="create-organization">
            <button
              onClick={() => onCreateOrganizationClick()}
              className="flex items-center w-full px-4 py-2 text-md sm:text-sm text-gray-700 text-left hover:bg-gray-100"
            >
              <PlusCircleIcon className="sm:w-4 sm:h-4 w-6 h-6 mr-3" />
              <span>Create New Organization</span>
            </button>
          </Menu.Item>

          {user.organizations.length > 1 && (
            <div className="border-b border-gray-200 my-1 mx-2" />
          )}

          {user.organizations
            .filter((org) => org.id !== currentOrganization.id)
            .map((organization) => (
              <Menu.Item key={organization.id}>
                <OrganizationMenuItem
                  organization={organization}
                  onClick={(organization) => selectOrganization(organization)}
                />
              </Menu.Item>
            ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
