import { useState } from "react";
import type { FC, MouseEvent } from "react";
import { Fragment } from "react";
import { signOut } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, PlusCircleIcon, XIcon } from "@heroicons/react/outline";

import { classNames } from "@utils/classNames";
import { useMe } from "@hooks/useMe";
import { OrganizationType } from "@prisma/client";
import { useOrganization } from "@hooks/useOrganization";
import { NewOrganizationSlideOver } from "@components/NewOrganizationSlideOver";

const userNavigation = [
  { name: "Profile", href: "#" },
  { name: "Settings", href: "#" },
  {
    name: "Sign out",
    href: "#",
    action: (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      signOut();
    },
  },
];

export interface AppTopBarProps {
  currentNavId: string;
}

interface OrganizationDropdownProps {
  onCreateOrganizationClick: () => void;
}

const OrganizationDropdown: FC<OrganizationDropdownProps> = ({
  onCreateOrganizationClick,
}) => {
  const { user } = useMe();
  const { organization: currentOrganization, setOrganization } =
    useOrganization();

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
                onClick={() => setOrganization(user.personalOrganization)}
                className={classNames(
                  active ||
                    currentOrganization.id === user.personalOrganization.id
                    ? "bg-gray-100"
                    : "",
                  "flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 text-left"
                )}
              >
                <div className="flex flex-col">
                  <span className="text-xs">{user.user.name}</span>
                  <span className="text-xs text-gray-400">personal</span>
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
                    onClick={() => setOrganization(organization)}
                    className={classNames(
                      active || currentOrganization.id === organization.id
                        ? "bg-gray-100"
                        : "",
                      "flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 text-left"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs">
                        {organization.type === OrganizationType.PERSONAL
                          ? user.user.name
                          : organization.name}
                      </span>
                      <span className="text-xs text-gray-400">
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
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100"
            >
              <span>Create New Org</span>
              <PlusCircleIcon className="w-4 h-4" />
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const ProfileDropdown: FC = () => {
  const { user } = useMe();

  if (!user) {
    return null;
  }

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs flex items-center text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
          <span className="sr-only">Open user menu</span>
          {user.user.image && (
            <img
              className="h-8 w-8 rounded-full"
              src={user.user.image}
              alt=""
            />
          )}
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
        <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <a
                  href={item.href}
                  onClick={item.action}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  {item.name}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const AppTopBar: FC<AppTopBarProps> = () => {
  const { user } = useMe();

  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <Disclosure as="nav" className="bg-gray-100 top-0 left-0 right-0">
        {({ open }) => (
          <>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="font-bold text-zinc-800">Assetier</span>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <OrganizationDropdown
                    onCreateOrganizationClick={() => setOpen(true)}
                  />

                  <ProfileDropdown />
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="pt-4 pb-3 border-t border-gray-200">
                <OrganizationDropdown
                  onCreateOrganizationClick={() => setOpen(true)}
                />

                {/* <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    {user.user.image && (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.user.image}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="ml-3 flex">
                    <div className="text-base font-medium text-gray-800 mr-1">
                      {user.user.name}
                    </div>
                    <div>
                      <div className="text-xs font-medium bg-zinc-600 text-white px-2 rounded-lg">
                        {user.personalOrganization.organizationPlan.name}
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      onClick={item.action}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <NewOrganizationSlideOver open={open} onClose={() => setOpen(false)} />
    </>
  );
};
