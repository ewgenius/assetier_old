import type { FC } from "react";
import { Switch } from "@headlessui/react";

import { classNames } from "@utils/classNames";

export interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export const Toggle: FC<ToggleProps> = ({
  label,
  description,
  checked,
  onChange,
}) => (
  <Switch.Group as="div" className="flex items-center justify-between">
    <span className="flex flex-grow flex-col">
      <Switch.Label
        as="span"
        className="text-sm font-medium text-gray-900"
        passive
      >
        {label}
      </Switch.Label>
      {description && (
        <Switch.Description
          as="span"
          className="truncate text-sm text-gray-500"
        >
          {description}
        </Switch.Description>
      )}
    </span>
    <Switch
      checked={checked}
      onChange={onChange}
      className={classNames(
        checked ? "bg-zinc-600" : "bg-gray-200",
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          checked ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        )}
      />
    </Switch>
  </Switch.Group>
);
