import Link from "next/link";
import { FC, Fragment, MouseEvent, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

import { classNames } from "@utils/classNames";
import { useMe } from "@hooks/useMe";

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

const ProfileDropdown: FC<{}> = () => {
  const { user } = useMe();

  if (!user) {
    return null;
  }

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs flex items-center text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
          <div className="relative ml-2 pr-[40px] mr-4 flex">
            <div className="font-medium text-sm text-gray-800">
              {user.user.name}
            </div>
            <div className="absolute top-0 right-0 text-xs font-medium bg-zinc-600 text-white px-2 rounded-lg">
              {user.personalOrganization.organizationPlan.name}
            </div>
          </div>
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
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
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

export const AppTopBar: FC<AppTopBarProps> = ({ currentNavId }) => {
  const { user } = useMe();

  if (!user) {
    return null;
  }

  return (
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
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {user.user.image && (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.user.image}
                      alt=""
                    />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user.user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user.personalOrganization.organizationPlan.name}
                  </div>
                </div>
              </div>
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
  );
};
