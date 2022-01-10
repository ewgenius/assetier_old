import { createContext } from "react";
import type { OrganizationWithPlan } from "@assetier/types";

export interface AppContextInterface {
  organization: OrganizationWithPlan;
  setOrganization: (organization: OrganizationWithPlan) => void;
}

export const AppContext = createContext<AppContextInterface>({
  organization: {
    id: "",
  } as OrganizationWithPlan,
  setOrganization: () => {
    /* dummy */
  },
});
