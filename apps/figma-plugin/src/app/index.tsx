import * as React from "react";
import { FC, useEffect, useState, useCallback } from "react";
import { render } from "react-dom";
import { Message, MessageType } from "../types";
import { Spinner } from "./components/Spinner";
import { ProfileTopbar } from "./components/ProfileTopbar";
import { useMe } from "./hooks/useMe";
import { authFetcher } from "./utils/fetcher";
import { AppContext, useAppContext } from "./AppContext";

import { App } from "./App";
import { SignInPage } from "./pages/SignInPage";
import { SettingsPage } from "./pages/SettingsPage";

export type SelectedNode = Pick<SceneNode, "id">;

function postMessage(type: MessageType, data?: any) {
  parent.postMessage({ pluginMessage: { type, data } }, "*");
}

const Main: FC<{
  selectedNodes: SelectedNode[];
}> = ({ selectedNodes }) => {
  const { token, organizationId, projectId } = useAppContext();
  const { user } = useMe();
  const [exporting, setExporting] = useState(false);

  const exportNodes = useCallback(() => {
    setExporting(true);
    authFetcher(token)(
      `${process.env.API_URL}/api/organizations/ckxxi36d30541ujndn755fii3/projects/cky0ly54k0072jmnd5q3fmqrl/figma/import`,
      {
        method: "POST",
        body: JSON.stringify({
          nodes: selectedNodes.map((node) => node.id),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      setExporting(false);
    });
  }, [selectedNodes]);

  if (!user) {
    return (
      <div className="h-full p-2 flex flex-col justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!organizationId || !projectId) {
    return <SettingsPage />;
  }

  return (
    <div className="h-full flex flex-col">
      <ProfileTopbar />

      <div className="p-2 flex-grow overflow-y-auto">
        {selectedNodes && selectedNodes.length > 0 ? (
          <>
            <button
              type="button"
              disabled={exporting}
              className="flex w-full items-center px-2.5 py-1.5 mb-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={exportNodes}
            >
              <span>Export selected nodes</span>
              <span className="flex-grow" />
              {exporting && <Spinner className="ml-1" size={2} />}
            </button>

            <div>
              {selectedNodes.map((node) => (
                <div key={node.id} className="p-2 flex text-xs">
                  node #{node.id}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-600">Select some elements first</p>
        )}
      </div>
    </div>
  );
};

export const Root: FC = () => {
  // function getNodes() {
  //   postMessage(MessageType.GetSelectedNodes);
  // }

  const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<SelectedNode[]>([]);

  function setOrgProject(organizationId: string, projectId: string) {
    setOrganizationId(organizationId);
    setProjectId(projectId);
    postMessage(MessageType.SetOrgProject, {
      organizationId,
      projectId,
    });
  }

  function onSignIn(token: string) {
    setToken(token);
    postMessage(MessageType.SetToken, {
      token,
    });
  }

  useEffect(() => {
    const onMessage = ({
      data: { pluginMessage },
    }: MessageEvent<{
      pluginMessage: Message;
    }>) => {
      if (pluginMessage) {
        switch (pluginMessage.type) {
          case MessageType.Init: {
            if (pluginMessage.data.token) {
              setToken(pluginMessage.data.token);
              setOrganizationId(pluginMessage.data.organizationId);
              setProjectId(pluginMessage.data.projectId);
            }
            setInitialized(true);
            break;
          }

          case MessageType.ReceiveSelectedNodes: {
            setSelectedNodes(pluginMessage.data.selection);
            break;
          }
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  if (!initialized) {
    return (
      <div className="h-full p-2 flex flex-col justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!token) {
    return <SignInPage onSignIn={onSignIn} />;
  }

  return (
    // <AppContext.Provider
    //   value={{ token, organizationId, projectId, setOrgProject }}
    // >
    <Main selectedNodes={selectedNodes} />
    // </AppContext.Provider>
  );
};

render(<App />, document.getElementById("root"));
