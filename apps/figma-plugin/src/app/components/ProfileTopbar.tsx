import React from "react";
import { useAppContext } from "../AppContext";
import { useAccountProject } from "../hooks/useAccountProject";
import { useMe } from "../hooks/useMe";

export const AccountProjectInfo = () => {
  const { accountId, projectId } = useAppContext();
  const { account, project } = useAccountProject(
    accountId as string,
    projectId as string
  );

  if (!account || !project) {
    return null;
  }

  return (
    <div className="text-xs">
      <span>{account.name}</span> / <span>{project.name}</span>
    </div>
  );
};

export const ProfileTopbar = () => {
  const { user } = useMe();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center border-b border-gray-200 bg-white py-2 px-4">
      <div className="flex-grow">
        <AccountProjectInfo />
      </div>
      <span className="text-xs">{user.user.name}</span>
      {user.user.image && (
        <img className="ml-2 h-6 w-6 rounded-full" src={user.user.image} />
      )}
    </div>
  );
};
