import React from "react";
import UserNameDisplay from "../UserNameDisplay";

interface UserNameOrIdProps {
  userId: string;
  userName?: string;
  showUserName: boolean;
  fallbackText?: string;
}

const UserNameOrId: React.FC<UserNameOrIdProps> = ({
  userId,
  userName,
  showUserName,
  fallbackText = "-",
}) => {
  if (showUserName) {
    return <UserNameDisplay userId={userId} fallbackText={fallbackText} />;
  }

  return (
    <span className="text-gray-700" title={userName ? "Username" : "User ID"}>
      {userName || userId || fallbackText}
    </span>
  );
};

export default UserNameOrId;
