import useSWR from "swr";
import { useAppContext } from "../AppContext";
import { authFetcher } from "../utils/fetcher";
import type { UserMe } from "@assetier/types";

export function useMe() {
  const { accessToken } = useAppContext();
  const { data, error } = useSWR<UserMe>(
    `${process.env.API_URL}/api/figma/plugin/me`,
    authFetcher(accessToken as string)
  );
  return {
    user: data,
    error,
  };
}
