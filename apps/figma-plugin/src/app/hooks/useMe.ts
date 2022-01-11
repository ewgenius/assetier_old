import useSWR from "swr";
import { useAppContext } from "../AppContext";
import { authFetcher } from "../utils/fetcher";

export function useMe() {
  const { token } = useAppContext();
  const { data, error } = useSWR<any>(
    `${process.env.API_URL}/api/figma/auth/me`,
    authFetcher(token)
  );
  return {
    user: data,
    error,
  };
}
