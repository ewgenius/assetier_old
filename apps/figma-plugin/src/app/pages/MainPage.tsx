import * as React from "react";
import { FC, useState, useCallback } from "react";
import { MessageType } from "../../types";
import { Spinner } from "../components/Spinner";
import { ProfileTopbar } from "../components/ProfileTopbar";
import { useMe } from "../hooks/useMe";
import { authFetcher } from "../utils/fetcher";
import { useAppContext } from "../AppContext";

import { SettingsPage } from "../pages/SettingsPage";

export const MainPage: FC<{
  // selectedNodes: SelectedNode[];
}> = () => {
  const { token, selectedNodes, organizationId, projectId } = useAppContext();
  const { user } = useMe();
  const [exporting, setExporting] = useState(false);

  const exportNodes = useCallback(() => {
    setExporting(true);
    if (token) {
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
    }
  }, [selectedNodes, token]);

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
    <div className="h-full flex flex-col">
      <ProfileTopbar />

      <div className="p-4 flex-grow overflow-y-auto">
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