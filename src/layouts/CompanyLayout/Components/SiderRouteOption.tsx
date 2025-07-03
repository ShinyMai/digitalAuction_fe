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
  const role = user?.roleName;

  // Filter items based on user's role
  const filteredItems = useMemo(
    () =>
      items
        .filter(
          (item) => role && item.roleView.includes(role)
        )
        .map((item) => ({
          ...item,
          className: "bg-stone-300/30",
        })),
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
    <div className="w-full h-full bg-gradient-to-r bg-stone-300/30 text-white">
      <div className="w-full h-28 flex items-center justify-center">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-full h-auto max-h-20 object-contain border-2 border-white/20 rounded-xl"
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
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SiderRouteOption;
