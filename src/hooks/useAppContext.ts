import { useContext } from "react";
import { AppContext } from "../appContext";

export function useAppContext() {
  return useContext(AppContext);
}
