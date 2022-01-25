import type { FC } from "react";
import type { GithubInstallation } from "@assetier/prisma";
import { GithubAccountType } from "@assetier/prisma";

import { classNames } from "@utils/classNames";
import { Select } from "@components/Select";
import { AddGithubAccountButton } from "./AddGithubAccountButton";

export interface GithubAccountSelectorProps {
  selectedAccount: GithubInstallation | null;
  onChange: (account: GithubInstallation | null) => void;
  accounts?: GithubInstallation[];
  defaultAccountId?: string;
  disabled?: boolean;
  disableOrgs?: boolean;
}

export const GithubAccountSelector: FC<GithubAccountSelectorProps> = ({
  onChange,
  selectedAccount,
  accounts,
  defaultAccountId,
  disabled,
  disableOrgs,
}) => {
  return (
    <>
      {accounts && accounts.length === 0 ? (
        <>
          <div className="mb-1 block text-sm font-medium text-gray-700">
            Github Account
          </div>
          <AddGithubAccountButton mode="button" />
        </>
      ) : (
        <>
          <Select
            label="Github Account"
            placeholder="Select Github account"
            disabled={disabled}
            selectedItem={selectedAccount}
            items={accounts}
            onChange={onChange}
            renderButton={(account: GithubInstallation) => (
              <span className="flex items-center">
                <img
                  src={account.accountAvatarUrl}
                  alt=""
                  className="h-5 w-5 flex-shrink-0 rounded-full border border-zinc-200 bg-white"
                />
                <span className="ml-3 block truncate">
                  {account.accountLogin}
                </span>
              </span>
            )}
            renderBefore={() => (
              <li>
                <AddGithubAccountButton mode="option" />
                <div className="w-full px-2 py-1">
                  <div className="border-b border-gray-100" />
                </div>
              </li>
            )}
            preselectedId={defaultAccountId}
            getItemId={(account: GithubInstallation) => account.id}
            isItemDisabled={
              disableOrgs
                ? (account: GithubInstallation) =>
                    account.accountType === GithubAccountType.ORGANIZATION
                : undefined
            }
            renderItem={(account: GithubInstallation, { selected }) => (
              <div className="flex items-center">
                <img
                  src={account.accountAvatarUrl}
                  alt=""
                  className="h-5 w-5 flex-shrink-0 rounded-full border border-zinc-200"
                />
                <span
                  className={classNames(
                    selected ? "font-semibold" : "font-normal",
                    "ml-3 block flex-grow truncate"
                  )}
                >
                  {account.accountLogin}
                </span>
                {disableOrgs &&
                  account.accountType === GithubAccountType.ORGANIZATION && (
                    <span className="text-xs text-gray-400">
                      not available on personal account
                    </span>
                  )}
              </div>
            )}
          />
        </>
      )}
    </>
  );
};
