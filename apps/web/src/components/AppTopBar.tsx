import { useState } from "react";
import type { FC } from "react";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

import { useMe } from "@hooks/useMe";
import { NewOrganizationSlideOver } from "@components/NewOrganizationSlideOver";
import { ProfileDropdown, userNavigation } from "@components/ProfileDropdown";
import { OrganizationDropdown } from "@components/OrganizationDropdown";

export interface AppTopBarProps {
  currentNavId?: string;
}

export const AppTopBar: FC<AppTopBarProps> = () => {
  const { user } = useMe();

  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <Disclosure as="nav" className="top-0 left-0 right-0">
        {({ open, close }) => (
          <>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <span className="font-bold text-zinc-800">Assetier</span>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-2">
                  <OrganizationDropdown
                    onCreateOrganizationClick={() => setOpen(true)}
                  />

                  <ProfileDropdown />
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2">
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
              <div className="border-t border-gray-200 pt-4 pb-3">
                <OrganizationDropdown
                  onCreateOrganizationClick={() => {
                    setOpen(true);
                    close();
                  }}
                  onSelectOrganization={close}
                />

                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      onClick={item.action}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
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
