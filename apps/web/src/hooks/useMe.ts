import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import type { UserMe } from "@assetier/types";

export function useMe() {
  const { data, error } = useSWR<UserMe>("/api/user/me", fetcher);
  return {
    user: data,
    error,
  };
}
