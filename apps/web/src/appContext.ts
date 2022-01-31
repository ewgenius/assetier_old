import { createContext } from "react";
import type { AccountWithPlan } from "@assetier/types";

export interface AppContextInterface {
  account: AccountWithPlan;
  setAccount: (account: AccountWithPlan) => void;
}

export const AppContext = createContext<AppContextInterface>({
  account: {
    id: "",
  } as AccountWithPlan,
  setAccount: () => {
    /* dummy */
  },
});
