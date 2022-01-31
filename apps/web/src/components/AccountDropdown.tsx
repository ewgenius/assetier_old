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

import type { AccountWithPlan } from "@assetier/types";
import { classNames } from "@utils/classNames";
import { useMe } from "@hooks/useMe";
import { AccountType } from "@assetier/prisma";
import { useAccount } from "@hooks/useAccount";

export interface AccountMenuItemProps {
  account: AccountWithPlan;
  onClick?: (account: AccountWithPlan) => void;
  active?: boolean;
}

export const AccountMenuItem: FC<AccountMenuItemProps> = ({
  account,
  onClick,
  active,
}) => {
  const { user } = useMe();

  return (
    <button
      onClick={onClick && (() => onClick(account))}
      className={classNames(
        active ? "bg-gray-100" : "",
        !!onClick ? "cursor-pointer hover:bg-gray-100" : "cursor-default",
        "flex w-full items-center px-4 py-2 text-left text-sm text-gray-700"
      )}
    >
      <div className="mr-2 -ml-1 rounded-lg bg-zinc-200 p-2 sm:p-1">
        {account.type === AccountType.PERSONAL ? (
          <UserIcon className="h-4 w-4" />
        ) : (
          <UserGroupIcon className="h-4 w-4" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-md sm:text-xs">
          {account.type === AccountType.PERSONAL
            ? user?.user.name
            : account.name}
        </span>
        <span className="text-sm text-gray-400 sm:text-xs">
          {account.type === AccountType.PERSONAL ? "personal" : "team"}
        </span>
      </div>
    </button>
  );
};

export interface AccountDropdownProps {
  onCreateAccountClick: () => void;
  onSelectAccount?: () => void;
}

export const AccountDropdown: FC<AccountDropdownProps> = ({
  onCreateAccountClick,
  onSelectAccount,
}) => {
  const { push } = useRouter();
  const { user } = useMe();
  const { account: currentAccount, setAccount } = useAccount();

  const selectAccount = useCallback(
    (account: AccountWithPlan) => {
      setAccount(account);
      if (onSelectAccount) {
        onSelectAccount();
      }
    },
    [onSelectAccount, setAccount]
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
              {currentAccount.type === AccountType.PERSONAL
                ? user.user.name
                : currentAccount.name}
            </div>
            <div>
              <div className="rounded-lg bg-zinc-600 px-2 text-xs font-medium text-white">
                {currentAccount.subscription?.subscriptionPlan.planType}
              </div>
            </div>
          </div>
          <span className="sr-only">Open account menu</span>
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
          <AccountMenuItem account={currentAccount} />

          <Menu.Item key="account-settings">
            <button
              onClick={() => push(`/app/${currentAccount.id}/settings`)}
              className="text-md flex w-full items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 sm:text-sm"
            >
              <CogIcon className="mr-3 h-6 w-6 sm:h-4 sm:w-4" />
              <span>Settings</span>
            </button>
          </Menu.Item>

          <Menu.Item key="create-account">
            <button
              onClick={() => onCreateAccountClick()}
              className="text-md flex w-full items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 sm:text-sm"
            >
              <PlusCircleIcon className="mr-3 h-6 w-6 sm:h-4 sm:w-4" />
              <span>Create New Account</span>
            </button>
          </Menu.Item>

          {user.accounts.length > 1 && (
            <div className="my-1 mx-2 border-b border-gray-200" />
          )}

          {user.accounts
            .filter((acc) => acc.id !== currentAccount.id)
            .map((account) => (
              <Menu.Item key={account.id}>
                <AccountMenuItem
                  account={account}
                  onClick={(account) => selectAccount(account)}
                />
              </Menu.Item>
            ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
