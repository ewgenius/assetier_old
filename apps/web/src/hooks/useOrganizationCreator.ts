import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";

import type { OrganizationWithPlan } from "@utils/types";
import { fetcher } from "@utils/fetcher";
import { useInputState } from "./useInputState";
import { useMe } from "./useMe";

export function useOrganizationCreator() {
  const { mutate } = useSWRConfig();
  const [creating, setCreating] = useState(false);
  const [name, setNameHandler] = useInputState("");
  const { user } = useMe();

  const createOrganization = useCallback(() => {
    setCreating(true);

    return fetcher(`/api/organizations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    })
      .then((organization) => {
        if (user) {
          mutate("/api/user/me", {
            ...user,
            organizations: [...user?.organizations, organization],
          });
        }

        return organization as OrganizationWithPlan;
      })
      .finally(() => setCreating(false));
  }, [name, mutate, user]);

  return {
    creating,
    createOrganization,
    name,
    setNameHandler,
  };
}
