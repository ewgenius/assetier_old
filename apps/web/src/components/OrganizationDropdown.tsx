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

import type { OrganizationWithPlan } from "@assetier/types";
import { classNames } from "@utils/classNames";
import { useMe } from "@hooks/useMe";
import { OrganizationType } from "@assetier/prisma";
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
        "flex w-full items-center px-4 py-2 text-left text-sm text-gray-700"
      )}
    >
      <div className="mr-2 -ml-1 rounded-lg bg-zinc-200 p-2 sm:p-1">
        {organization.type === OrganizationType.PERSONAL ? (
          <UserIcon className="h-4 w-4" />
        ) : (
          <UserGroupIcon className="h-4 w-4" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-md sm:text-xs">
          {organization.type === OrganizationType.PERSONAL
            ? user?.user.name
            : organization.name}
        </span>
        <span className="text-sm text-gray-400 sm:text-xs">
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
        <Menu.Button className="flex flex-grow items-center rounded-md py-2 px-2 text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 sm:h-8 sm:max-w-xs">
          <div className="mx-2 flex flex-grow">
            <div className="mr-1 text-lg font-medium text-gray-800 sm:text-sm">
              {currentOrganization.type === OrganizationType.PERSONAL
                ? user.user.name
                : currentOrganization.name}
            </div>
            <div>
              <div className="rounded-lg bg-zinc-600 px-2 text-xs font-medium text-white">
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:w-56">
          <OrganizationMenuItem organization={currentOrganization} />

          <Menu.Item key="organization-settings">
            <button
              onClick={() => push(`/app/${currentOrganization.id}/settings`)}
              className="text-md flex w-full items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 sm:text-sm"
            >
              <CogIcon className="mr-3 h-6 w-6 sm:h-4 sm:w-4" />
              <span>Settings</span>
            </button>
          </Menu.Item>

          <Menu.Item key="create-organization">
            <button
              onClick={() => onCreateOrganizationClick()}
              className="text-md flex w-full items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 sm:text-sm"
            >
              <PlusCircleIcon className="mr-3 h-6 w-6 sm:h-4 sm:w-4" />
              <span>Create New Organization</span>
            </button>
          </Menu.Item>

          {user.organizations.length > 1 && (
            <div className="my-1 mx-2 border-b border-gray-200" />
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
