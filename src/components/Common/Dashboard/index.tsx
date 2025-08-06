import React, { useState, useEffect } from "react";
import { Card, Typography, Avatar } from "antd";
import {
  UserOutlined,
  CrownOutlined,
  TeamOutlined,
  TrophyOutlined,
  CalendarOutlined,
  HeartOutlined,
  RocketOutlined,
  StarFilled,
  ThunderboltFilled,
  FireFilled,
} from "@ant-design/icons";
import { useCurrentUserInfo } from "../../../hooks/useUserInfo";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { userInfo } = useCurrentUserInfo();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [floatingIcons] = useState([
    {
      id: 1,
      icon: StarFilled,
      color: "text-yellow-400",
      x: 10,
      y: 20,
      delay: 0,
    },
    {
      id: 2,
      icon: ThunderboltFilled,
      color: "text-blue-400",
      x: 85,
      y: 15,
      delay: 1,
    },
    { id: 3, icon: FireFilled, color: "text-red-400", x: 15, y: 80, delay: 2 },
    {
      id: 4,
      icon: StarFilled,
      color: "text-purple-400",
      x: 90,
      y: 75,
      delay: 3,
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleIcon = (roleName?: string) => {
    switch (roleName?.toLowerCase()) {
      case "director":
        return <CrownOutlined className="text-2xl text-purple-600" />;
      case "manager":
        return <TeamOutlined className="text-2xl text-blue-600" />;
      case "staff":
        return <UserOutlined className="text-2xl text-green-600" />;
      case "auctioneer":
        return <TrophyOutlined className="text-2xl text-orange-600" />;
      default:
        return <UserOutlined className="text-2xl text-gray-600" />;
    }
  };

  const getRoleColor = (roleName?: string) => {
    switch (roleName?.toLowerCase()) {
      case "director":
        return "purple";
      case "manager":
        return "blue";
      case "staff":
        return "green";
      case "auctioneer":
        return "orange";
      default:
        return "default";
    }
  };

  const getWelcomeMessage = (roleName?: string) => {
    const hour = new Date().getHours();
    const timeGreeting =
      hour < 12
        ? "Chào buổi sáng"
        : hour < 18
        ? "Chào buổi chiều"
        : "Chào buổi tối";

    switch (roleName?.toLowerCase()) {
      case "director":
        return `${timeGreeting}, Giám đốc ${userInfo?.name || ""}!`;
      case "manager":
        return `${timeGreeting}, Quản lý ${userInfo?.name || ""}!`;
      case "staff":
        return `${timeGreeting}, ${userInfo?.name || ""}!`;
      case "auctioneer":
        return `${timeGreeting}, Đấu giá viên ${userInfo?.name || ""}!`;
      default:
        return `${timeGreeting}, ${userInfo?.name || "Người dùng"}!`;
    }
  };
  const currentDate = currentTime.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTimeString = currentTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden pt-16">
      {/* Floating Background Icons */}
      {floatingIcons.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            className={`absolute ${item.color} opacity-20 animate-bounce`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: "3s",
            }}
          >
            <IconComponent className="text-4xl" />
          </div>
        );
      })}

      <div className="max-w-2xl mx-auto w-full relative z-10 px-6">
        {" "}
        <Card className="text-center shadow-2xl border-0 backdrop-blur-sm bg-white/90 transform hover:scale-105 transition-all duration-500 hover:shadow-3xl animate-fade-in hover-glow mt-8">
          <div className="py-6 px-6 relative">
            {/* Sparkle animation on hover */}
            <div className="absolute top-4 right-4 text-yellow-400 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-sparkle">
              <StarFilled className="text-2xl" />
            </div>{" "}
            <div className="mb-4 animate-slide-in-left">
              <div className="relative inline-block group">
                <Avatar
                  size={80}
                  className={`bg-${getRoleColor(
                    userInfo?.roleName
                  )}-500 transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl hover-lift`}
                  icon={<UserOutlined className="text-2xl" />}
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md transform group-hover:scale-125 transition-all duration-300 animate-sparkle">
                  <div className="text-lg">
                    {getRoleIcon(userInfo?.roleName)}
                  </div>
                </div>
                {/* Pulse ring effect */}
                <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
              </div>
            </div>{" "}
            <div className="mb-4 animate-slide-in-right">
              <Title
                level={3}
                className="!mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient"
              >
                {getWelcomeMessage(userInfo?.roleName)}
              </Title>

              <Text className="text-base text-gray-600 block mb-3 animate-fade-in">
                Chào mừng bạn trở lại hệ thống quản lý đấu giá
              </Text>

              {/* Live clock */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2 inline-flex items-center shadow-inner mb-2 border border-blue-100 hover-lift">
                <CalendarOutlined className="text-blue-600 mr-2 animate-bounce text-sm" />
                <div className="text-center">
                  <Text className="text-blue-700 font-medium block text-sm">
                    {currentDate}
                  </Text>
                  <Text className="text-blue-600 text-xs font-mono animate-pulse">
                    {currentTimeString}
                  </Text>
                </div>
              </div>

              {/* Motivational badge */}
              <div className="mt-2 animate-fade-in">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-3 py-1 inline-flex items-center border border-green-200 hover-lift">
                  <RocketOutlined className="text-green-600 mr-2 animate-pulse text-sm" />
                  <Text className="text-green-700 font-medium text-xs">
                    Sẵn sàng cho một ngày làm việc tuyệt vời!
                  </Text>{" "}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Text className="text-gray-500 text-xs flex items-center justify-center gap-1 hover:text-gray-700 transition-colors duration-300">
                Được tạo với{" "}
                <HeartOutlined className="text-red-500 animate-pulse hover:scale-125 transition-transform duration-300" />{" "}
                bởi Digital Auction Team
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
