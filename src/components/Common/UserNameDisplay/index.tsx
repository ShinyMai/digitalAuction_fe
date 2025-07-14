import React from "react";
import { Spin } from "antd";
import { useUserInfo } from "../../../hooks/useUserInfo";

interface UserNameDisplayProps {
  userId: string;
  fallbackText?: string;
}

const UserNameDisplay: React.FC<UserNameDisplayProps> = ({ userId, fallbackText = "-" }) => {
  const { userInfo, loading, error } = useUserInfo(userId);

  if (loading) {
    return <Spin size="small" />;
  }

  if (error || !userInfo) {
    return <span className="text-gray-400">{fallbackText}</span>;
  }

  return (
    <span className="text-gray-700" title={userInfo.email || userInfo.citizenIdentification}>
      {userInfo.name || fallbackText}
    </span>
  );
};

export default UserNameDisplay;
