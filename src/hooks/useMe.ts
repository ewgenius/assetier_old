import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import { UserResponse } from "@utils/types";

export function useMe() {
  const { data, error } = useSWR<UserResponse>("/api/user/me", fetcher);
  return {
    user: data,
    error,
  };
}
