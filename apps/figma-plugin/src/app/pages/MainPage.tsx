import * as React from "react";
import { FC, useState, useCallback } from "react";
import { Spinner } from "../components/Spinner";
import { ProfileTopbar } from "../components/ProfileTopbar";
import { useMe } from "../hooks/useMe";
import { authFetcher } from "../utils/fetcher";
import { useAppContext } from "../AppContext";
import { Page } from "../components/Page";
import { postMessage } from "../utils/postMessage";
import { MessageType } from "../../types";

export const MainPage: FC = () => {
  const { token, selectedNodes, organizationId, projectId } = useAppContext();
  const { user } = useMe();
  const [exporting, setExporting] = useState(false);
  const [postfixSize, setPostfixSize] = useState(false);
  const togglePostfixSize = useCallback(
    () => setPostfixSize(!postfixSize),
    [postfixSize]
  );

  function setup() {
    postMessage(MessageType.Setup);
  }

  const exportNodes = useCallback(() => {
    setExporting(true);
    if (token) {
      authFetcher<Record<string, string>>(token)(
        `${process.env.API_URL}/api/organizations/${organizationId}/projects/${projectId}/figma/import`,
        {
          method: "POST",
          body: JSON.stringify({
            nodes: selectedNodes.map((node) => ({
              id: node.id,
              name: postfixSize ? `${node.name}-${node.size}` : node.name,
            })),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((results) => {
          postMessage(MessageType.ExportNodes, results);
          setExporting(false);
        })
        .catch(() => {
          setExporting(false);
        });
    }
  }, [selectedNodes, postfixSize, organizationId, projectId, token]);

  if (!user) {
    return (
      <div className="h-full p-2 flex flex-col justify-center items-center">
        <Spinner />
      </div>
    );
  }

  // if (!organizationId || !projectId) {
  //   return <SettingsPage />;
  // }

  return (
    <Page>
      <ProfileTopbar />

      <div className="p-4 flex-grow overflow-y-auto flex flex-col gap-2">
        <button
          type="button"
          className="flex w-full items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zink-500"
          onClick={setup}
        >
          <span>Setup</span>
        </button>
        {selectedNodes && selectedNodes.length > 0 ? (
          <>
            <button
              type="button"
              disabled={exporting}
              className="flex w-full items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zink-500"
              onClick={exportNodes}
            >
              <span>Export selected nodes</span>
              <span className="flex-grow" />
              {exporting && <Spinner className="ml-1" size={2} />}
            </button>

            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="postfix-size"
                  name="postfix-size"
                  type="checkbox"
                  className="focus:ring-zink-500 h-4 w-4 text-zink-600 border-gray-300 rounded"
                  checked={postfixSize}
                  onClick={togglePostfixSize}
                />
              </div>
              <div className="ml-3 text-xs">
                <label
                  htmlFor="postfix-size"
                  className="font-medium text-gray-700"
                >
                  Size in postfix
                </label>
                <p className="text-gray-500 font-mono">icon-16.svg</p>
              </div>
            </div>

            <div>
              {selectedNodes.map((node) => (
                <div key={node.id} className="p-2 flex text-xs">
                  #{node.id}{" "}
                  {postfixSize ? `${node.name}-${node.size}` : node.name}
                </div>
              ))}
            </div>

            {selectedNodes &&
              selectedNodes.length === 1 &&
              selectedNodes[0].meta && (
                <div>{JSON.stringify(selectedNodes[0].meta)}</div>
              )}
          </>
        ) : (
          <p className="text-xs text-gray-600">Select some elements first</p>
        )}
      </div>
    </Page>
  );
};
