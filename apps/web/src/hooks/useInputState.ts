import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

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

export type UseDelayedInputState = [
  string,
  string,
  ChangeEventHandler<HTMLInputElement>,
  boolean,
  () => void,
  Dispatch<SetStateAction<string>>
];

export function useDelayedInputState(
  defaultValue = "",
  delay = 500
): UseDelayedInputState {
  const [value, setValueHandler, reset, set] = useInputState();
  const [delayedValue, setDelayedValue] = useState(defaultValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return [
    value,
    delayedValue,
    setValueHandler,
    value !== delayedValue,
    reset,
    set,
  ];
}
