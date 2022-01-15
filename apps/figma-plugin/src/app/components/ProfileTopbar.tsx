import React from "react";
import { useMe } from "../hooks/useMe";

export const ProfileTopbar = () => {
  const { user } = useMe();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center py-2 px-4 border-b border-gray-200 bg-white">
      <span className="flex-grow text-xs">{user.user.name}</span>
      {user.user.image && (
        <img className="w-6 h-6 rounded-full" src={user.user.image} />
      )}
    </div>
  );
};
