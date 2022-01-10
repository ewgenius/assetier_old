import type { FC } from "react";

import { Select } from "@components/Select";
import type { GithubBranch } from "lib-types";
import { classNames } from "@utils/classNames";

export interface GithubBranchSelectorProps {
  label?: string | false;
  branches?: GithubBranch[];
  defaultBranchName?: string;
  disabled?: boolean;
  selectedBranch?: GithubBranch | null;
  onChange: (branch: GithubBranch | null) => void;
}

export const GithubBranchSelector: FC<GithubBranchSelectorProps> = ({
  label,
  branches,
  disabled,
  defaultBranchName,
  selectedBranch,
  onChange,
}) => {
  return (
    <Select
      label={
        label === undefined
          ? "Select Branch"
          : label === false
          ? undefined
          : label
      }
      placeholder="Select branch"
      disabled={disabled}
      items={branches}
      selectedItem={selectedBranch}
      onChange={onChange}
      renderButton={(branch) => (
        <span className="block truncate">{branch.name}</span>
      )}
      renderPlaceholder={() => (
        <span className="block truncate">{defaultBranchName}</span>
      )}
      preselectedId={defaultBranchName}
      getItemId={(branch) => branch.name}
      renderItem={(branch, { selected }) => (
        <span
          className={classNames(
            selected ? "font-semibold" : "font-normal",
            "block truncate"
          )}
        >
          {branch.name}
        </span>
      )}
    />
  );
};
