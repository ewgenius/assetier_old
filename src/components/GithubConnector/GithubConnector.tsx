import { FC, useCallback, useEffect, useState } from "react";
import type { GithubInstallation, Project } from "@prisma/client";

import { useAppContext } from "@hooks/useAppContext";
import { useGithubAccounts } from "@hooks/useGithubAccounts";

import { GithubAccountSelector } from "./GithubAccountSelector";
import { GithubRepositorySelector } from "./GithubRepositorySelector";

export interface GithubConnectorProps {
  value?: Pick<Project, "githubInstallationId" | "repositoryId">;
  onChange: (
    data: Pick<Project, "githubInstallationId" | "repositoryId"> | null
  ) => void;
}

export const GithubConnector: FC<GithubConnectorProps> = ({
  value,
  onChange,
}) => {
  const { organization } = useAppContext();

  const { accounts } = useGithubAccounts(organization.id);
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

  useEffect(() => {
    if (accounts && value?.githubInstallationId) {
      const account = accounts.find((a) => a.id === value.githubInstallationId);
      account && setSelectedAccount(account);
    }
  }, [accounts, value]);

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
