import { createContext } from "react";
import type { Organization } from "@prisma/client";
import { OrganizationWithPlan } from "@utils/types";

export interface AppContextInterface {
  organization: OrganizationWithPlan;
}

export const AppContext = createContext<AppContextInterface>({
  organization: {
    id: "",
  } as OrganizationWithPlan,
});
