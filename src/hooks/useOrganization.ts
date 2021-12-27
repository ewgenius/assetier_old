import { useAppContext } from "./useAppContext";

export function useOrganization() {
  return useAppContext().organization;
}
