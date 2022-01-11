import * as React from "react";
import { FC, useEffect, useState, useCallback } from "react";
import { render } from "react-dom";
import { Message, MessageType } from "../types";
import { Spinner } from "./components/Spinner";
import { useMe } from "./hooks/useMe";
import { authFetcher } from "./utils/fetcher";
import { AppContext, useAppContext } from "./AppContext";

export type SelectedNode = Pick<SceneNode, "id">;

function postMessage(type: MessageType, data?: any) {
  parent.postMessage({ pluginMessage: { type, data } }, "*");
}

export interface SignInProps {
  onSignIn: (token: string) => void;
}

export const SignIn: FC<SignInProps> = ({ onSignIn }) => {
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
      fetch(`${process.env.API_URL}/api/figma/auth/${pair.readKey}`)
        .then((r) => r.json())
        .then((updatedPair) => {
          if (updatedPair?.token) {
            onSignIn(updatedPair.token);
          }
        });
    }
  }, [pair?.readKey]);

  return (
    <div className="h-full p-2 flex flex-col justify-center items-center">
      <button
        type="button"
        disabled={state === "sent"}
        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={state === "pooling" ? refresh : signIn}
      >
        {state === "pooling" ? "Refresh" : "Sign In"}
        {state === "sent" && <Spinner className="ml-2" />}
      </button>
    </div>
  );
};

const ProfileTopbar = () => {
  const { user } = useMe();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center p-2 border-b border-gray-200 bg-white">
      <span className="flex-grow text-sm">{user.user.name}</span>
      {user.user.image && (
        <img className="w-5 h-5 rounded-full" src={user.user.image} />
      )}
    </div>
  );
};

const OrgProjectSelector: FC = () => {
  const { organizationId, projectId, setOrgProject } = useAppContext();
  const { user } = useMe();

  const [orgId, setOrgId] = useState(organizationId || "");
  const [projId, setProjectId] = useState(projectId || "");

  const submit = useCallback(() => {
    setOrgProject(orgId, projId);
  }, [orgId, projId]);

  if (!user) {
    return (
      <div className="h-full p-2 flex flex-col justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ProfileTopbar />
      <div className="p-2 flex flex-col">
        <div>
          <label className="text-xs">org id</label>
          <input
            value={orgId}
            onChange={({ target: { value } }) => setOrgId(value)}
          />
        </div>

        <div>
          <label className="text-xs">project id</label>
          <input
            value={projId}
            onChange={({ target: { value } }) => setProjectId(value)}
          />
        </div>

        <button
          type="button"
          disabled={!orgId || !projId}
          className="flex w-full items-center px-2.5 py-1.5 mb-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={submit}
        >
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

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
    return <OrgProjectSelector />;
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

export const App: FC = () => {
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
    return <SignIn onSignIn={onSignIn} />;
  }

  return (
    <AppContext.Provider
      value={{ token, organizationId, projectId, setOrgProject }}
    >
      <Main selectedNodes={selectedNodes} />
    </AppContext.Provider>
  );
};

render(<App />, document.getElementById("root"));
