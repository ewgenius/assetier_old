import { FC } from "react";

import { Select } from "@components/Select";
import { GithubBranch } from "@utils/types";
import { classNames } from "@utils/classNames";

export interface GithubBranchSelectorProps {
  label?: string | false;
  branches?: GithubBranch[];
  defaultBranchName?: string;
  selectedBranch?: GithubBranch | null;
  onChange: (branch: GithubBranch | null) => void;
}

export const GithubBranchSelector: FC<GithubBranchSelectorProps> = ({
  label,
  branches,
  defaultBranchName,
  selectedBranch,
  onChange,
}) => {
  return (
    <div>
      <Select
        label={
          label === undefined
            ? "Select Branch"
            : label === false
            ? undefined
            : label
        }
        placeholder="Select branch"
        items={branches}
        selectedItem={selectedBranch}
        onChange={onChange}
        renderButton={(branch) => (
          <span className="block truncate">{branch.name}</span>
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
    </div>
  );
};
