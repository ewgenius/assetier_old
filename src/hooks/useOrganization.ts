import { useAppContext } from "./useAppContext";

export function useOrganization() {
  const { organization, setOrganization } = useAppContext();

  return {
    organization,
    setOrganization,
  };
}
