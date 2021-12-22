import { createContext } from "react";
import type { Organization } from "@prisma/client";

export interface AppContextInterface {
  organization: Organization;
}

export const AppContext = createContext<AppContextInterface>({
  organization: {
    id: "",
  } as Organization,
});
