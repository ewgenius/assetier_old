import * as React from "react";
import { useMe } from "../hooks/useMe";

export const ProfileTopbar = () => {
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
