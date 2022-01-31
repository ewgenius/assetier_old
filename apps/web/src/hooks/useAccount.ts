import { AccountWithPlan } from "@assetier/types";
import { useAppContext } from "./useAppContext";

export function useAccount(defaultAccount?: AccountWithPlan) {
  const { account, setAccount } = useAppContext();

  return {
    account: defaultAccount || account,
    setAccount,
  };
}
