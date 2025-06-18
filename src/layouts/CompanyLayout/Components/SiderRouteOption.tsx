/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChartOutlined,
  ScheduleOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { STAFF_ROUTES } from "../../../routers";

interface MenuItem {
  key: string;
  icon: React.ReactElement;
  label: string;
  url: string;
  roleView: string[];
}

const items: MenuItem[] = [
  {
    key: "1",
    icon: <BarChartOutlined />,
    label: "Thống kê",
    url: STAFF_ROUTES.SUB.STATISTICS,
    roleView: ["Manager", "Director", "Admin"],
  },
  {
    key: "2",
    icon: <ScheduleOutlined />,
    label: "Danh sách các buổi đấu giá",
    url: STAFF_ROUTES.SUB.AUCTION_LIST,
    roleView: [
      "Staff",
      "Auctioneer",
      "Director",
      "Manager",
      "Admin",
    ],
  },
  {
    key: "3",
    icon: <ScheduleOutlined />,
    label: "Tạo buổi đấu giá",
    url: STAFF_ROUTES.SUB.POST_AUCTION,
    roleView: ["Staff", "Admin"],
  },
  {
    key: "4",
    icon: <HomeOutlined />,
    label: "Hỗ trợ đăng ký tham gia đấu giá",
    url: STAFF_ROUTES.SUB.DASHBOARD,
    roleView: ["Staff", "Admin"],
  },
  {
    key: "5",
    icon: <TeamOutlined />,
    label: "Danh sách nhân lực",
    url: STAFF_ROUTES.SUB.PROPERTIES,
    roleView: ["Director", "Manager", "Admin"],
  },
].map((item) => ({
  ...item,
  icon: React.createElement(item.icon.type),
}));

const SiderRouteOption = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;

  // Filter items based on user's role
  const filteredItems = items.filter(
    (item) => role && item.roleView.includes(role)
  );
  const getCurrentKey = () => {
    const pathname = location.pathname;
    const rolePath = role?.toLowerCase();

    // Remove the role prefix to get the actual route
    const routeWithoutRole = pathname.replace(
      `/${rolePath}/`,
      ""
    );

    const currentItem = filteredItems.find(
      (item) =>
        routeWithoutRole === item.url ||
        routeWithoutRole.startsWith(item.url)
    );
    return currentItem
      ? currentItem.key
      : filteredItems[0]?.key || "1";
  };
  const onClick: MenuProps["onClick"] = (e) => {
    const item = filteredItems.find((i) => i.key === e.key);
    if (item) {
      const rolePath = role?.toLowerCase();
      navigate(`/${rolePath}/${item.url}`, {
        replace: true,
      });
    }
  };

  return (
    <div className="w-full h-full flex justify-center pt-6 bg-slate-50">
      <div className="w-full">
        <Menu
          onClick={onClick}
          theme="light"
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          items={filteredItems as MenuProps["items"]}
          style={{
            width: "100%",
            border: "none",
            fontSize: "16px",
          }}
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default SiderRouteOption;
