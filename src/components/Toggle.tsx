import { FC } from "react";
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
    <span className="flex-grow flex flex-col">
      <Switch.Label
        as="span"
        className="text-sm font-medium text-gray-900"
        passive
      >
        {label}
      </Switch.Label>
      {description && (
        <Switch.Description as="span" className="text-sm text-gray-500">
          {description}
        </Switch.Description>
      )}
    </span>
    <Switch
      checked={checked}
      onChange={onChange}
      className={classNames(
        checked ? "bg-zinc-600" : "bg-gray-200",
        "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          checked ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
        )}
      />
    </Switch>
  </Switch.Group>
);
