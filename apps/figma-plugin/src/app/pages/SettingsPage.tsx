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
      <div className="flex h-full flex-col items-center justify-center p-2">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ProfileTopbar />
      <div className="flex flex-col p-2">
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
          className="mb-2 flex w-full items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={submit}
        >
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};
