import { FC, useEffect, useState } from "react";

import { classNames } from "@utils/classNames";
import {
  Repository,
  useGithubAccountRepositories,
} from "@hooks/useGithubAccountRepositories";
import { Select } from "@components/Select";

export interface GithubRepositorySelectorProps {
  repositories?: Repository[];
  selectedRepository?: Repository | null;
  onChange: (repository: Repository | null) => void;
  defaultRepositoryId?: string;
}

export const GithubRepositorySelector: FC<GithubRepositorySelectorProps> = ({
  selectedRepository,
  repositories,
  onChange,
  defaultRepositoryId,
}) => {
  return (
    <div>
      <Select
        label="Repository"
        placeholder="Select Repository"
        items={repositories}
        selectedItem={selectedRepository}
        onChange={onChange}
        renderButton={(repository) => (
          <span className="block truncate">
            @{repository.owner.login}/{repository.name}
          </span>
        )}
        preselectedId={defaultRepositoryId}
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
    </div>
  );
};
