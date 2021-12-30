import { FC, useCallback, useState } from "react";
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
  onChange: (data: GithubConnection | null) => void;
}

export const GithubConnector: FC<GithubConnectorProps> = ({ onChange }) => {
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
    <div className="space-y-4">
      <div>
        <GithubAccountSelector
          accounts={accounts}
          selectedAccount={selectedAccount}
          onChange={setSelectedAccount}
        />
      </div>

      {selectedAccount && (
        <div>
          <GithubRepositorySelector
            repositories={repositories}
            selectedRepository={selectedRepository}
            onChange={setSelectedRepository}
          />
        </div>
      )}

      {selectedRepository && (
        <GithubBranchSelector
          branches={branches}
          selectedBranch={selectedBranch}
          defaultBranchName="main"
          onChange={connect}
        />
      )}
    </div>
  );
};
