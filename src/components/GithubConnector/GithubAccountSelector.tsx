import { FC } from "react";
import type { GithubInstallation } from "@prisma/client";

import { classNames } from "@utils/classNames";
import { Select } from "@components/Select";
import { AddGithubAccountButton } from "./AddGithubAccountButton";

export interface GithubAccountSelectorProps {
  selectedAccount: GithubInstallation | null;
  onChange: (account: GithubInstallation | null) => void;
  accounts?: GithubInstallation[];
  defaultAccountId?: string;
  disabled?: boolean;
}

export const GithubAccountSelector: FC<GithubAccountSelectorProps> = ({
  onChange,
  selectedAccount,
  accounts,
  defaultAccountId,
  disabled,
}) => {
  return (
    <>
      {accounts && accounts.length === 0 ? (
        <>
          <div className="block mb-1 text-sm font-medium text-gray-700">
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
            renderButton={(account) => (
              <span className="flex items-center">
                <img
                  src={account.accountAvatarUrl}
                  alt=""
                  className="flex-shrink-0 h-5 w-5 border border-zinc-200 bg-white rounded-full"
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
            getItemId={(account) => account.id}
            renderItem={(account, { selected }) => (
              <div className="flex items-center">
                <img
                  src={account.accountAvatarUrl}
                  alt=""
                  className="flex-shrink-0 h-5 w-5 border border-zinc-200 rounded-full"
                />
                <span
                  className={classNames(
                    selected ? "font-semibold" : "font-normal",
                    "ml-3 block truncate"
                  )}
                >
                  {account.accountLogin}
                </span>
              </div>
            )}
          />
        </>
      )}
    </>
  );
};
