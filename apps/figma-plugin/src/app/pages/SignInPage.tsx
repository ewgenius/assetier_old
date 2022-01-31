import React, { useEffect } from "react";
import { FC, useState } from "react";
import type { Auth0DeviceCode, Auth0DeviceToken } from "@assetier/types";
import { Spinner } from "../components/Spinner";
import { fetcher } from "../utils/fetcher";
import { ActionType, useAppContext } from "../AppContext";
import { postMessage } from "../utils/postMessage";
import { MessageType } from "../../types";

export const SignInPage: FC = () => {
  const { dispatch } = useAppContext();
  const [state, setState] = useState<"none" | "pooling" | "done">("none");
  const [code, setCode] = useState<Auth0DeviceCode | null>(null);
  const [token, setToken] = useState<Auth0DeviceToken | null>(null);

  function signIn() {
    fetcher<Auth0DeviceCode>(`${process.env.API_URL}/api/figma/auth/code`, {
      method: "POST",
    }).then((code) => {
      setState("pooling");
      setCode(code);
      window.open(code.verification_uri_complete, "_blank");
    });
  }

  useEffect(() => {
    let poolingTimer: number | null = null;
    if (code) {
      poolingTimer = setInterval(() => {
        fetcher<Auth0DeviceToken>(
          `${process.env.API_URL}/api/figma/auth/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              device_code: code.device_code,
            }),
          }
        )
          .then((r) => {
            console.log("success", r);
            setToken(r);

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

            setState("done");

            if (poolingTimer) {
              clearInterval(poolingTimer);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, code.interval * 1000);
    }

    return () => {
      if (poolingTimer) {
        clearInterval(poolingTimer);
      }
    };
  }, [code]);

  return (
    <div className="flex h-full flex-col items-center justify-center p-2">
      <img
        src="https://www.assetier.app/logo-256x256.png"
        className="h-16 w-16"
      />
      <h1 className="my-2 text-lg font-semibold">Assetier</h1>

      <div className="mt-16 flex w-full max-w-[200px] flex-col px-4">
        {state === "none" ? (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={signIn}
          >
            Sign In
          </button>
        ) : state === "pooling" ? (
          <div className="flex flex-col items-center justify-center">
            {code && code.user_code && (
              <div className="font-mono uppercase">{code.user_code}</div>
            )}
            <Spinner className="ml-2" />
          </div>
        ) : (
          <div>Done!</div>
        )}
      </div>
    </div>
  );
};
