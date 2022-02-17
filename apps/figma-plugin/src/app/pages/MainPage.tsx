import React from "react";
import { FC, useState, useCallback } from "react";
import { Spinner } from "../components/Spinner";
import { ProfileTopbar } from "../components/ProfileTopbar";
import { useMe } from "../hooks/useMe";
import { authFetcher } from "../utils/fetcher";
import { useAppContext } from "../AppContext";
import { Page } from "../components/Page";
import { postMessage } from "../utils/postMessage";
import { MessageType } from "../../types";
import { SettingsPage } from "./SettingsPage";

import { IconComponent } from "../assets/IconComponent";
import { IconFrame } from "../assets/IconFrame";

export const MainPage: FC = () => {
  const { accessToken, selectedNodes, accountId, projectId } = useAppContext();
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
    if (accessToken) {
      authFetcher<Record<string, string>>(accessToken)(
        `${process.env.API_URL}/api/figma/plugin/accounts/${accountId}/projects/${projectId}/import`,
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
  }, [selectedNodes, postfixSize, accountId, projectId, accessToken]);

  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-2">
        <Spinner />
      </div>
    );
  }

  if (!accountId || !projectId) {
    return <SettingsPage />;
  }

  return (
    <Page>
      <ProfileTopbar />

      <div className="flex flex-grow flex-col gap-2 overflow-y-auto p-4">
        {/* <button
          type="button"
          className="focus:ring-zink-500 flex w-full items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={setup}
        >
          <span>Setup</span>
        </button> */}
        {selectedNodes && selectedNodes.length > 0 ? (
          <>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={exporting}
                className="focus:ring-zink-500 flex w-full items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                onClick={exportNodes}
              >
                <span>Export selected nodes</span>
                <span className="flex-grow" />
                {exporting && <Spinner className="ml-1" size={2} />}
              </button>

              <button
                type="button"
                disabled={exporting}
                className="focus:ring-zink-500 flex  items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                onClick={exportNodes}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            {/* 
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="postfix-size"
                  name="postfix-size"
                  type="checkbox"
                  className="focus:ring-zink-500 text-zink-600 h-4 w-4 rounded border-gray-300"
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
                <p className="font-mono text-gray-500">icon-16.svg</p>
              </div>
            </div> */}

            <div>
              {selectedNodes.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center gap-2 p-2 text-xs"
                >
                  {node.type === "COMPONENT" ? (
                    <IconComponent />
                  ) : (
                    <IconFrame />
                  )}
                  <div className="flex-grow">
                    {postfixSize ? `${node.name}-${node.size}` : node.name}
                  </div>
                  <div className="text-gray-400">#{node.id}</div>
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
