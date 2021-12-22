import { ChangeEventHandler, useState } from "react";

export type UseInputState = [
  string,
  ChangeEventHandler<HTMLInputElement>,
  () => void
];

export function useInputState(defaultValue = ""): UseInputState {
  const [value, setValue] = useState(defaultValue);
  const setValueHandler: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => setValue(value);

  return [value, setValueHandler, () => setValue("")];
}
