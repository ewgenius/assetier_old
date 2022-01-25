import React from "react";
import { useMe } from "../hooks/useMe";

export const ProfileTopbar = () => {
  const { user } = useMe();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center border-b border-gray-200 bg-white py-2 px-4">
      <span className="flex-grow text-xs">{user.user.name}</span>
      {user.user.image && (
        <img className="h-6 w-6 rounded-full" src={user.user.image} />
      )}
    </div>
  );
};
