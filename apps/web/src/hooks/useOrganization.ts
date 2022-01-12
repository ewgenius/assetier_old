import { OrganizationWithPlan } from "@assetier/types";
import { useAppContext } from "./useAppContext";

export function useOrganization(defaultOrganization?: OrganizationWithPlan) {
  const { organization, setOrganization } = useAppContext();

  return {
    organization: defaultOrganization || organization,
    setOrganization,
  };
}
