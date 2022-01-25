import type { FC } from "react";

import { classNames } from "@utils/classNames";
import type { Repository } from "@hooks/useGithubAccountRepositories";
import { Select } from "@components/Select";
import { ExclamationIcon, LockClosedIcon } from "@heroicons/react/outline";

export interface GithubRepositorySelectorProps {
  repositories?: Repository[];
  selectedRepository?: Repository | null;
  onChange: (repository: Repository | null) => void;
  defaultRepositoryId?: string;
  disabled?: boolean;
  disablePrivateRepos?: boolean;
}

export const GithubRepositorySelector: FC<GithubRepositorySelectorProps> = ({
  selectedRepository,
  repositories,
  onChange,
  defaultRepositoryId,
  disabled,
  disablePrivateRepos,
}) => {
  return (
    <div>
      <Select
        label="Repository"
        placeholder="Select Repository"
        disabled={disabled}
        items={
          disablePrivateRepos
            ? repositories?.filter((r) => !r.private)
            : repositories
        }
        selectedItem={selectedRepository}
        onChange={onChange}
        renderButton={(repository: Repository) => (
          <span className="block truncate">
            @{repository.owner.login}/{repository.name}
          </span>
        )}
        renderBefore={
          disablePrivateRepos
            ? () => (
                <div className="flex items-center gap-2 bg-zinc-200 p-2 text-zinc-600">
                  <ExclamationIcon className="h-4 w-4" />
                  <span>private repos not available on hobby plan</span>
                </div>
              )
            : undefined
        }
        preselectedId={defaultRepositoryId}
        getItemId={(repository: Repository) => String(repository.id)}
        isItemDisabled={
          disablePrivateRepos
            ? (repository: Repository) => repository.private
            : undefined
        }
        renderItem={(repository: Repository, { selected }) => (
          <div className="flex items-center justify-between">
            <span
              className={classNames(
                selected ? "font-semibold" : "font-normal",
                "block truncate"
              )}
            >
              @{repository.owner.login}/{repository.name}
            </span>
            {repository.private && (
              <LockClosedIcon className="h-4 w-4 opacity-50" />
            )}
          </div>
        )}
      />
    </div>
  );
};
