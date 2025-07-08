/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChartOutlined,
  ScheduleOutlined,
  HomeOutlined,
  TeamOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ADMIN_ROUTES,
  STAFF_ROUTES,
} from "../../../routers";
import { assets } from "../../../assets";

interface MenuItem {
  key: string;
  icon: React.ReactElement;
  label: string;
  url?: string;
  statusSubMenu?: string;
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
    ],
  },
  {
    key: "3",
    icon: <ScheduleOutlined />,
    label: "Tạo buổi đấu giá",
    url: STAFF_ROUTES.SUB.POST_AUCTION,
    roleView: ["Staff"],
  },
  {
    key: "4",
    icon: <HomeOutlined />,
    label: "Hỗ trợ đăng ký tham gia đấu giá",
    url: STAFF_ROUTES.SUB.DASHBOARD,
    roleView: ["Staff"],
  },
  {
    key: "5",
    icon: <TeamOutlined />,
    label: "Danh sách nhân lực",
    url: STAFF_ROUTES.SUB.PROPERTIES,
    roleView: ["Director", "Manager"],
  },
  {
    key: "6",
    icon: <UsergroupDeleteOutlined />,
    label: "Tạo tài khoản mới",
    url: ADMIN_ROUTES.SUB.ADD_EMPLOYEES,
    roleView: ["Admin"],
  },
].map((item) => ({
  ...item,
  icon: React.createElement(item.icon.type),
}));

const SiderRouteOption = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName; // Filter items based on user's role
  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) => role && item.roleView.includes(role)
      ),
    [role]
  );

  const getCurrentKey = () => {
    const pathname = location.pathname;
    const rolePath = role?.toLowerCase();
    const routeWithoutRole = pathname.replace(
      `/${rolePath}/`,
      ""
    );
    let currentKey = filteredItems[0]?.key || "1";

    for (const item of filteredItems) {
      if (
        routeWithoutRole === item.url ||
        routeWithoutRole.startsWith(item.url || "/")
      ) {
        currentKey = item.key;
      }
    }
    return currentKey;
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
    <div className="w-full h-full bg-gradient-to-b from-sky-50 to-sky-100 border-r border-sky-200 shadow-sm">
      <div className="w-full h-28 flex items-center justify-center bg-gradient-to-r from-sky-100 to-sky-50 border-b border-sky-200">
        <img
          src={assets.logoNo}
          alt="Logo"
          className="w-full h-auto max-h-20 object-contain border-2 border-sky-300 rounded-xl shadow-md"
        />
      </div>
      <div className="w-full">
        <Menu
          onClick={onClick}
          theme="light"
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          defaultOpenKeys={["2"]}
          items={filteredItems as MenuProps["items"]}
          className="w-full bg-transparent border-none [&_.ant-menu-item]:text-sky-700 [&_.ant-menu-item]:font-medium [&_.ant-menu-item]:mx-2 [&_.ant-menu-item]:my-1 [&_.ant-menu-item]:rounded-lg [&_.ant-menu-item]:px-4 [&_.ant-menu-item]:py-3 [&_.ant-menu-item-selected]:bg-sky-100 [&_.ant-menu-item-selected]:text-sky-900 [&_.ant-menu-item-selected]:font-semibold [&_.ant-menu-item:hover]:bg-sky-50 [&_.ant-menu-item:hover]:text-sky-900"
          style={{
            backgroundColor: "transparent",
            border: "none",
          }}
        />
      </div>
    </div>
  );
};

export default SiderRouteOption;
