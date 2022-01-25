import type { FC, MouseEvent } from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

import { classNames } from "@utils/classNames";
import { useMe } from "@hooks/useMe";

export const userNavigation = [
  { name: "Profile", href: "#" },
  { name: "Settings", href: "#" },
  {
    name: "Sign out",
    href: "#",
    action: (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      // TODO:
      // signOut();
    },
  },
];

export const ProfileDropdown: FC = () => {
  const { user } = useMe();

  if (!user) {
    return null;
  }

  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="flex max-w-xs items-center rounded-md text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2">
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
