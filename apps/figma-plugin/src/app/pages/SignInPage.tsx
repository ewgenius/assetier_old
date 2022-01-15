import React from "react";
import { FC, useState, useCallback } from "react";
import { FigmaReadWritePair } from "@assetier/types";
import { ActionType, useAppContext } from "../AppContext";
import { Spinner } from "../components/Spinner";
import { fetcher } from "../utils/fetcher";
import { postMessage } from "../utils/postMessage";
import { MessageType } from "../../types";

export const SignInPage: FC = () => {
  const { dispatch } = useAppContext();
  const [state, setState] = useState<"none" | "sent" | "pooling">("none");
  const [pair, setPair] = useState<{
    readKey: string;
    writeKey: string;
    token: string;
  } | null>(null);

  function signIn() {
    setState("sent");
    fetch(`${process.env.API_URL}/api/figma/auth`)
      .then((r) => r.json())
      .then((pair) => {
        setPair(pair);
        setState("pooling");
        // start pooling
        window.open(
          `${process.env.API_URL}/auth/figma/${pair.writeKey}`,
          "_blank"
        );
      });
  }

  const refresh = useCallback(() => {
    if (pair?.readKey) {
      fetcher<FigmaReadWritePair>(
        `${process.env.API_URL}/api/figma/auth/${pair.readKey}`
      ).then((updatedPair) => {
        console.log(updatedPair);
        if (
          updatedPair?.token &&
          updatedPair?.organizationId &&
          updatedPair?.projectId
        ) {
          dispatch({
            type: ActionType.SignedIn,
            payload: {
              token: updatedPair.token,
              organizationId: updatedPair.organizationId,
              projectId: updatedPair.projectId,
            },
          });
          postMessage(MessageType.SetToken, {
            token: updatedPair.token,
            organizationId: updatedPair.organizationId,
            projectId: updatedPair.projectId,
          });
        }
      });
    }
  }, [pair?.readKey]);

  return (
    <div className="h-full p-2 flex flex-col justify-center items-center">
      <img
        src="https://www.assetier.app/logo-256x256.png"
        className="w-16 h-16"
      />
      <h1 className="text-lg my-2 font-semibold">Assetier</h1>

      <div className="mt-16 w-full max-w-[200px] flex flex-col px-4">
        <button
          type="button"
          disabled={state === "sent"}
          className="inline-flex items-center text-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          onClick={state === "pooling" ? refresh : signIn}
        >
          {state === "pooling" ? "Refresh" : "Sign In"}
          {state === "sent" && <Spinner className="ml-2" />}
        </button>
      </div>
    </div>
  );
};
