import { ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";

export type UseInputState = [
  string,
  ChangeEventHandler<HTMLInputElement>,
  () => void,
  Dispatch<SetStateAction<string>>
];

export function useInputState(defaultValue = ""): UseInputState {
  const [value, setValue] = useState(defaultValue);
  const setValueHandler: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => setValue(value);

  return [value, setValueHandler, () => setValue(""), setValue];
}
