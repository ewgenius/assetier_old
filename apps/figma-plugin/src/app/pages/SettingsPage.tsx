import React from "react";
import { FC, useState, useCallback } from "react";
import { Spinner } from "../components/Spinner";
import { ProfileTopbar } from "../components/ProfileTopbar";
import { useMe } from "../hooks/useMe";
import { useAppContext } from "../AppContext";

export const SettingsPage: FC = () => {
  const { organizationId, projectId, setOrgProject } = useAppContext();
  const { user } = useMe();

  const [orgId, setOrgId] = useState(organizationId || "");
  const [projId, setProjectId] = useState(projectId || "");

  const submit = useCallback(() => {
    // setOrgProject(orgId, projId);
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
