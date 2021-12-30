import { FC, useCallback, useEffect, useState } from "react";
import type { GithubInstallation } from "@prisma/client";

import { useGithubAccounts } from "@hooks/useGithubAccounts";
import {
  Repository,
  useGithubAccountRepositories,
} from "@hooks/useGithubAccountRepositories";
import { useGithubRepositoryBranches } from "@hooks/useGithubRepositoryBranches";
import type { GithubBranch, GithubConnection } from "@utils/types";
import { GithubBranchSelector } from "./GithubBranchSelector";
import { GithubAccountSelector } from "./GithubAccountSelector";
import { GithubRepositorySelector } from "./GithubRepositorySelector";
import { classNames } from "@utils/classNames";

export interface GithubConnectorProps {
  connection?: GithubConnection | null;
  onChange: (connection: GithubConnection | null) => void;
  layout?: "column" | "row";
}

export const GithubConnector: FC<GithubConnectorProps> = ({
  onChange,
  connection,
  layout,
}) => {
  const { accounts } = useGithubAccounts();
  const [selectedAccount, setSelectedAccount] =
    useState<GithubInstallation | null>(null);

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
    [selectedAccount, selectedRepository]
  );

  return (
    <div
      className={classNames(
        "flex",
        layout === "column" && "flex-col space-y-4",
        layout === "row" && "flex-row sm:space-x-2 md:space-x-4",
        !layout &&
          "flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2 md:space-x-4"
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
          onChange={setSelectedAccount}
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
            disabled={!selectedAccount}
            repositories={repositories}
            selectedRepository={selectedRepository}
            onChange={setSelectedRepository}
            defaultRepositoryId={
              connection ? String(connection.repositoryId) : undefined
            }
          />
        </div>
      )}

      {(selectedRepository || connection) && (
        <div
          className={classNames(
            layout === "row" && "flex-1 flex-shrink-0 max-w-[220px]",
            !layout && "sm:flex-1 sm:flex-shrink-0 sm:max-w-[220px]"
          )}
        >
          <GithubBranchSelector
            disabled={!selectedRepository}
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
