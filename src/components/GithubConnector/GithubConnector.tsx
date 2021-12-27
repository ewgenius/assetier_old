import { FC, useCallback, useEffect, useState } from "react";
import type { GithubInstallation, Project } from "@prisma/client";

import { useGithubAccounts } from "@hooks/useGithubAccounts";

import { GithubAccountSelector } from "./GithubAccountSelector";
import { GithubRepositorySelector } from "./GithubRepositorySelector";

export interface GithubConnectorProps {
  onChange: (
    data: Pick<Project, "githubInstallationId" | "repositoryId"> | null
  ) => void;
}

export const GithubConnector: FC<GithubConnectorProps> = ({ onChange }) => {
  const { accounts } = useGithubAccounts();
  const [selectedAccount, setSelectedAccount] =
    useState<GithubInstallation | null>(null);

  const selectRepository = useCallback(
    (repositoryId: number | null) => {
      onChange(
        repositoryId && selectedAccount
          ? {
              githubInstallationId: selectedAccount.id,
              repositoryId: repositoryId,
            }
          : null
      );
    },
    [selectedAccount]
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
            installationId={selectedAccount.installationId}
            onChange={selectRepository}
          />
        </div>
      )}
    </div>
  );
};
