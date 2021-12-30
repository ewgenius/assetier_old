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

export interface GithubConnectorProps {
  connection?: GithubConnection | null;
  onChange: (connection: GithubConnection | null) => void;
}

export const GithubConnector: FC<GithubConnectorProps> = ({
  onChange,
  connection,
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
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2 md:space-x-4">
      <div className="sm:flex-1 sm:flex-shrink-0">
        <GithubAccountSelector
          accounts={accounts}
          selectedAccount={selectedAccount}
          defaultAccountId={connection?.githubInstallationId}
          onChange={setSelectedAccount}
        />
      </div>

      {selectedAccount && (
        <div className="sm:flex-1 sm:flex-shrink-0">
          <GithubRepositorySelector
            repositories={repositories}
            selectedRepository={selectedRepository}
            onChange={setSelectedRepository}
            defaultRepositoryId={
              connection ? String(connection.repositoryId) : undefined
            }
          />
        </div>
      )}

      {selectedRepository && (
        <div className="sm:flex-1 sm:flex-shrink-0 sm:max-w-[220px]">
          <GithubBranchSelector
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
