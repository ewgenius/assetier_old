import { classNames } from "@utils/classNames";
import type { FC, InputHTMLAttributes } from "react";

export interface TextInputProps
  extends Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "disabled" | "name" | "id" | "value" | "onChange" | "placeholder"
  > {
  label?: string;
}

export const TextInput: FC<TextInputProps> = ({ label, ...inputProps }) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={inputProps.id}
          className="block text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      )}
      <div className={classNames(label && "mt-1")}>
        <input
          {...inputProps}
          type="text"
          className="block w-full shadow-sm disabled:opacity-50 sm:text-sm focus:ring-zinc-500 focus:border-zinc-500 border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};
