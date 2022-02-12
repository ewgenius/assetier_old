import useSWR from "swr";
import { useAppContext, ActionType } from "../AppContext";
import { authFetcher, fetcher } from "../utils/fetcher";
import type { UserMe, Auth0DeviceToken } from "@assetier/types";
import { postMessage } from "../utils/postMessage";
import { MessageType } from "../../types";

export function useMe() {
  const { accessToken, refreshToken, dispatch } = useAppContext();
  const { data, error } = useSWR<UserMe>(
    `${process.env.API_URL}/api/figma/plugin/me`,
    (input: RequestInfo, init?: RequestInit) =>
      authFetcher(accessToken as string)(input, init).catch((err) => {
        if (err.status === 401) {
          return fetcher<Auth0DeviceToken>(
            `${process.env.API_URL}/api/figma/auth/refresh`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refreshToken,
              }),
            }
          ).then((r) => {
            dispatch({
              type: ActionType.Authorized,
              payload: {
                accessToken: r.access_token,
                refreshToken: r.refresh_token,
              },
            });

            postMessage(MessageType.SetAuth, {
              accessToken: r.access_token,
              refreshToken: r.refresh_token,
            });

            return authFetcher(r.access_token)(input, init);
          });
        }
      })
  );
  return {
    user: data,
    error,
  };
}
