import React from "react";
import { useReducer, useEffect } from "react";
import type { FC } from "react";
import { AppContext, AppPage, appStateReducer, ActionType } from "./AppContext";
import { MessageType, PluginMessage } from "../types";

import { SignInPage } from "./pages/SignInPage";
import { BootPage } from "./pages/BootPage";
import { MainPage } from "./pages/MainPage";

export interface PageRouterProps {
  page: AppPage;
}

export const PageRouter: FC<PageRouterProps> = ({ page }) => {
  switch (page) {
    case AppPage.SignIn:
      return <SignInPage />;

    case AppPage.Main:
      return <MainPage />;

    case AppPage.Settings:
      return <div>settings</div>;

    case AppPage.Boot:
    default:
      return <BootPage />;
  }
};

export const App: FC = () => {
  const [appState, dispatch] = useReducer(appStateReducer, {
    page: AppPage.Boot,
    token: null,
    selectedNodes: [],
  });

  useEffect(() => {
    function onMessage(
      message: MessageEvent<{
        pluginMessage: PluginMessage;
      }>
    ) {
      const {
        data: { pluginMessage },
      } = message;
      if (pluginMessage) {
        console.log(pluginMessage);
        const { type, data } = pluginMessage;
        switch (type) {
          case MessageType.Init: {
            dispatch({
              type: ActionType.StoredStateReceived,
              payload:
                data.token && data.organizationId && data.projectId
                  ? {
                      token: data.token,
                      organizationId: data.organizationId,
                      projectId: data.projectId,
                      page: AppPage.Main,
                    }
                  : {
                      token: null,
                      page: AppPage.SignIn,
                    },
            });
            break;
          }

          case MessageType.ReceiveSelectedNodes: {
            dispatch({
              type: ActionType.SelectedNodesUpdated,
              payload: {
                selectedNodes: data.nodes,
              },
            });
            break;
          }
        }
      }
    }
    // 1) get data from backend
    // dispatch({
    //   type: ActionType.StoredStateReceived,
    //   payload: {
    //     page: AppPage.SignIn,
    //   },
    // });

    if (process.env.NODE_ENV === "development") {
      (window as any).onMessage = onMessage;
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <AppContext.Provider value={{ ...appState, dispatch }}>
      <div className="h-full flex-grow">
        <PageRouter page={appState.page} />
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="flex flex-col gap-1 bg-red-500 p-2 font-mono text-xs text-white">
          <button
            className="flex items-center rounded border border-red-700 bg-red-600 px-2 py-1 text-center text-xs font-medium text-white shadow-sm hover:bg-red-700"
            onClick={() => dispatch({ type: ActionType.NextPage })}
          >
            next page
          </button>

          <div className="w-full overflow-auto p-1 text-[8px]">
            {JSON.stringify(appState, null, 2)}
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};
