import type { FC } from "react";
import { useCallback, useState } from "react";
import type { GithubInstallation } from "@assetier/prisma";
import { GithubAccountType } from "@assetier/prisma";

import { useGithubAccounts } from "@hooks/useGithubAccounts";
import type { Repository } from "@hooks/useGithubAccountRepositories";
import { useGithubAccountRepositories } from "@hooks/useGithubAccountRepositories";
import { useGithubRepositoryBranches } from "@hooks/useGithubRepositoryBranches";
import type { GithubBranch, GithubConnection } from "@assetier/types";
import { GithubBranchSelector } from "./GithubBranchSelector";
import { GithubAccountSelector } from "./GithubAccountSelector";
import { GithubRepositorySelector } from "./GithubRepositorySelector";
import { classNames } from "@utils/classNames";
import { useAccount } from "@hooks/useAccount";

export interface GithubConnectorProps {
  connection?: GithubConnection | null;
  onChange: (connection: GithubConnection | null) => void;
  layout?: "column" | "row";
  disabled?: boolean;
}

export const GithubConnector: FC<GithubConnectorProps> = ({
  onChange,
  connection,
  layout,
  disabled,
}) => {
  const {
    account: {
      subscription,
      // accountPlan: { allowGithubOrgs, allowGithubPrivateRepos },
    },
  } = useAccount();
  const { accounts } = useGithubAccounts();
  const [selectedAccount, setSelectedAccount] =
    useState<GithubInstallation | null>(null);
  const selectAccount = useCallback(
    (account: GithubInstallation | null) => {
      if (
        !subscription ||
        (!subscription.subscriptionPlan.allowGithubOrgs &&
          account?.accountType !== GithubAccountType.USER)
      ) {
        return;
      } else {
        setSelectedAccount(account);
      }
    },
    [setSelectedAccount, subscription, subscription?.subscriptionPlan]
  );

  const { repositories } = useGithubAccountRepositories(
    selectedAccount?.installationId
  );
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null);

  const { branches } = useGithubRepositoryBranches(
    selectedAccount?.installationId,
    selectedRepository?.owner.login,
    selectedRepository?.name
  );
  const [selectedBranch, setSelectedBranch] = useState<GithubBranch | null>(
    null
  );

  const connect = useCallback(
    (branch: GithubBranch | null) => {
      setSelectedBranch(branch);
      onChange(
        selectedAccount && selectedRepository && branch
          ? {
              githubInstallationId: selectedAccount.id,
              repositoryId: selectedRepository.id,
              branch: branch.name,
            }
          : null
      );
    },
    [selectedAccount, selectedRepository, onChange]
  );

  return (
    <div
      className={classNames(
        "flex",
        layout === "column" && "flex-col space-y-4",
        layout === "row" && "flex-row sm:space-x-2 md:space-x-4",
        !layout &&
          "flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2 md:space-x-4"
      )}
    >
      <div
        className={classNames(
          layout === "row" && "flex-1 flex-shrink-0",
          !layout && "sm:flex-1 sm:flex-shrink-0"
        )}
      >
        <GithubAccountSelector
          accounts={accounts}
          selectedAccount={selectedAccount}
          defaultAccountId={connection?.githubInstallationId}
          onChange={selectAccount}
          disabled={disabled}
          disableOrgs={!subscription?.subscriptionPlan.allowGithubOrgs}
        />
      </div>

      {(selectedAccount || connection) && (
        <div
          className={classNames(
            layout === "row" && "flex-1 flex-shrink-0",
            !layout && "sm:flex-1 sm:flex-shrink-0"
          )}
        >
          <GithubRepositorySelector
            disabled={!selectedAccount || disabled}
            repositories={repositories}
            selectedRepository={selectedRepository}
            onChange={setSelectedRepository}
            defaultRepositoryId={
              connection ? String(connection.repositoryId) : undefined
            }
            disablePrivateRepos={
              !subscription?.subscriptionPlan.allowGithubPrivateRepos
            }
          />
        </div>
      )}

      {(selectedRepository || connection) && (
        <div
          className={classNames(
            layout === "row" && "max-w-[220px] flex-1 flex-shrink-0",
            !layout && "sm:max-w-[220px] sm:flex-1 sm:flex-shrink-0"
          )}
        >
          <GithubBranchSelector
            disabled={!selectedRepository || disabled}
            branches={branches}
            selectedBranch={selectedBranch}
            defaultBranchName={connection?.branch || "main"}
            onChange={connect}
          />
        </div>
      )}
    </div>
  );
};
