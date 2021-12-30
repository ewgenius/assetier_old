import { FC, useCallback, useEffect, useState } from "react";
import type { GithubInstallation, Project } from "@prisma/client";

import { useGithubAccounts } from "@hooks/useGithubAccounts";

import { GithubAccountSelector } from "./GithubAccountSelector";
import { GithubRepositorySelector } from "./GithubRepositorySelector";
import {
  Repository,
  useGithubAccountRepositories,
} from "@hooks/useGithubAccountRepositories";
import { GithubBranchSelector } from "./GithubBranchSelector";
import { useGithubRepositoryBranches } from "@hooks/useGithubRepositoryBranches";
import { GithubBranch } from "@utils/types";

export interface GithubConnectorProps {
  onChange: (
    data:
      | (Pick<Project, "githubInstallationId" | "repositoryId"> & {
          branch: string;
        })
      | null
  ) => void;
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
