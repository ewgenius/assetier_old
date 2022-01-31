import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";

import type { AccountWithPlan } from "@assetier/types";
import { fetcher } from "@utils/fetcher";
import { useInputState } from "./useInputState";
import { useMe } from "./useMe";

export function useAccountCreator() {
  const { mutate } = useSWRConfig();
  const [creating, setCreating] = useState(false);
  const [name, setNameHandler] = useInputState("");
  const { user } = useMe();

  const createAccount = useCallback(() => {
    setCreating(true);

    return fetcher(`/api/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    })
      .then((account) => {
        if (user) {
          mutate("/api/user/me", {
            ...user,
            accounts: [...user?.accounts, account],
          });
        }

        return account as AccountWithPlan;
      })
      .finally(() => setCreating(false));
  }, [name, mutate, user]);

  return {
    creating,
    createAccount,
    name,
    setNameHandler,
  };
}
