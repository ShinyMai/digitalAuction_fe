import React from "react";
import UserNameDisplay from "../UserNameDisplay";

interface UserNameOrIdProps {
  userId: string;
  userName?: string; // Username từ API (cho trường hợp AuctionType = "1")
  showUserName: boolean; // Điều kiện để hiển thị tên người dùng
  fallbackText?: string;
}

const UserNameOrId: React.FC<UserNameOrIdProps> = ({
  userId,
  userName,
  showUserName,
  fallbackText = "-",
}) => {
  if (showUserName) {
    // Nếu AuctionType = "2", sử dụng UserNameDisplay để gọi API
    return <UserNameDisplay userId={userId} fallbackText={fallbackText} />;
  }

  // Nếu AuctionType = "1", hiển thị userName từ API hoặc fallback
  return (
    <span className="text-gray-700" title={userName ? "Username" : "User ID"}>
      {userName || userId || fallbackText}
    </span>
  );
};

export default UserNameOrId;
