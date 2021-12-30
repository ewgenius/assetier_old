import { FC, useEffect, useState } from "react";

import { classNames } from "@utils/classNames";
import {
  Repository,
  useGithubAccountRepositories,
} from "@hooks/useGithubAccountRepositories";
import { Select } from "@components/Select";

export interface GithubRepositorySelectorProps {
  installationId: number;
  onChange?: (repositoryId: number | null) => void;
}

export const GithubRepositorySelector: FC<GithubRepositorySelectorProps> = ({
  installationId,
  onChange,
}) => {
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null);
  const { repositories } = useGithubAccountRepositories(installationId);

  useEffect(() => {
    selectRepository(null);
  }, [installationId]);

  const selectRepository = (repository: Repository | null) => {
    setSelectedRepository(repository);
    if (onChange) {
      onChange(repository ? repository.id : null);
    }
  };

  return (
    <Select
      label="Repository"
      placeholder="Select Repository"
      items={repositories}
      selectedItem={selectedRepository}
      onChange={selectRepository}
      renderButton={(repository) => (
        <span className="block truncate">
          @{repository.owner.login}/{repository.name}
        </span>
      )}
      getItemId={(repository: Repository) => String(repository.id)}
      renderItem={(repository: Repository, { selected }) => (
        <span
          className={classNames(
            selected ? "font-semibold" : "font-normal",
            "block truncate"
          )}
        >
          @{repository.owner.login}/{repository.name}
        </span>
      )}
    />
  );
};
