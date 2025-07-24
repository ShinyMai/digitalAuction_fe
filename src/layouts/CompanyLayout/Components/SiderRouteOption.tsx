/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChartOutlined,
  TeamOutlined,
  UserAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileAddOutlined,
  SolutionOutlined,
  ClockCircleOutlined,
  StopOutlined,
  HistoryOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { Menu, type MenuProps, Button, Tooltip } from "antd";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ADMIN_ROUTES, AUCTIONEER_ROUTES, MANAGER_ROUTES, STAFF_ROUTES } from "../../../routers";
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
    icon: <BarChartOutlined className="text-xl" />,
    label: "Thống kê",
    url: STAFF_ROUTES.SUB.STATISTICS,
    roleView: ["Manager", "Director", "Admin"],
  },
  {
    key: "2",
    icon: <FileSearchOutlined className="text-xl" />,
    label: "Danh sách các phiên đấu giá",
    url: STAFF_ROUTES.SUB.AUCTION_LIST,
    roleView: ["Staff", "Director", "Manager"],
  },
  {
    key: "3",
    icon: <SolutionOutlined className="text-xl" />,
    label: "Phiên đấu giá chưa công bố",
    url: STAFF_ROUTES.SUB.AUCTION_LIST_DRAFF,
    roleView: ["Staff", "Director", "Manager"],
  },
  {
    key: "4",
    icon: <FileAddOutlined className="text-xl" />,
    label: "Tạo phiên đấu giá",
    url: STAFF_ROUTES.SUB.POST_AUCTION,
    roleView: ["Staff"],
  },
  {
    key: "5",
    icon: <SolutionOutlined className="text-xl" />,
    label: "Hỗ trợ đăng ký tham gia đấu giá",
    url: STAFF_ROUTES.SUB.SUPPORT_REGISTER_AUCTION,
    roleView: ["Staff"],
  },
  {
    key: "6",
    icon: <TeamOutlined className="text-xl" />,
    label: "Quản lý nhân sự",
    url: STAFF_ROUTES.SUB.PROPERTIES,
    roleView: ["Director", "Manager"],
  },
  {
    key: "7",
    icon: <UserAddOutlined className="text-xl" />,
    label: "Tạo tài khoản mới",
    url: ADMIN_ROUTES.SUB.ADD_EMPLOYEES,
    roleView: ["Admin"],
  },
  {
    key: "8",
    icon: <ClockCircleOutlined className="text-xl" />,
    label: "Phiên đấu giá hiện tại",
    url: AUCTIONEER_ROUTES.SUB.AUCTION_NOW,
    roleView: ["Manager", "Staff", "Auctioneer"],
  },
  {
    key: "9",
    icon: <StopOutlined className="text-xl" />,
    label: "Phiên đấu giá bị hủy",
    url: MANAGER_ROUTES.SUB.AUCTION_LIST_CANCEL,
    roleView: ["Manager", "Staff"],
  },
  {
    key: "10",
    icon: <HistoryOutlined className="text-xl" />,
    label: "Phiên đấu giá đã tham gia",
    url: AUCTIONEER_ROUTES.SUB.LIST_AUCTION_ASSIGNED,
    roleView: ["Auctioneer"],
  },
  {
    key: "11",
    icon: <HistoryOutlined className="text-xl" />,
    label: "Thống kê",
    url: AUCTIONEER_ROUTES.SUB.DASHBOARD,
    roleView: ["Auctioneer"],
  },
].map((item) => ({
  ...item,
  icon: React.createElement(item.icon.type),
}));

interface SiderRouteOptionProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const SiderRouteOption = ({ collapsed = false, onCollapse }: SiderRouteOptionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;

  const filteredItems = useMemo(
    () => items.filter((item) => role && item.roleView.includes(role)),
    [role]
  );

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    onCollapse?.(newCollapsed);
  };

  const getCurrentKey = () => {
    const pathname = location.pathname;
    const rolePath = role?.toLowerCase();
    const routeWithoutRole = pathname.replace(`/${rolePath}/`, "");
    let currentKey = filteredItems[0]?.key || "1";

    for (const item of filteredItems) {
      if (routeWithoutRole === item.url || routeWithoutRole.startsWith(item.url || "/")) {
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
    <div
      className={`h-full bg-gradient-to-b from-sky-50 to-sky-100 border-r border-sky-200 shadow-sm transition-all duration-300 ${collapsed ? "w-20" : "w-full"
        }`}
    >
      {/* Header with Logo and Collapse Button */}
      <div
        className={`flex items-center justify-between bg-gradient-to-r from-sky-100 to-sky-50 border-b border-sky-200 transition-all duration-300 ${collapsed ? "h-20 px-2" : "h-28 px-4"
          }`}
      >
        {!collapsed && (
          <img
            src={assets.logoNo}
            alt="Logo"
            className="h-auto max-h-16 object-contain border-2 border-sky-300 rounded-xl shadow-md"
          />
        )}
        {/* Collapse/Expand Button */}{" "}
        <Tooltip title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"} placement="right">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleCollapse}
            className={`flex items-center justify-center text-sky-600 hover:text-sky-800 hover:bg-sky-100 border-sky-300 transition-all duration-300 ${collapsed ? "w-12 h-12 rounded-xl" : "w-10 h-10 rounded-lg ml-2"
              }`}
            style={{
              boxShadow: collapsed
                ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                : "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Tooltip>
      </div>

      {/* User Role Badge - only show when not collapsed */}
      {!collapsed && role && (
        <div className="px-4 py-3 border-b border-sky-200">
          <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-lg p-3 text-center shadow-sm">
            <span className="text-xs text-sky-600 font-medium block">Vai trò hiện tại</span>
            <span className="font-bold text-sky-800 text-sm">{role}</span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="w-full">
        <Menu
          onClick={onClick}
          theme="light"
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          defaultOpenKeys={["2"]}
          inlineCollapsed={collapsed}
          items={
            filteredItems.map((item) => ({
              ...item,
              label: collapsed ? null : item.label,
              title: collapsed ? item.label : undefined,
            })) as MenuProps["items"]
          }
          className={`w-full bg-transparent border-none transition-all duration-300 ${collapsed
            ? "[&_.ant-menu-item]:mx-1 [&_.ant-menu-item]:my-2 [&_.ant-menu-item]:rounded-xl [&_.ant-menu-item]:px-3 [&_.ant-menu-item]:py-4"
            : "[&_.ant-menu-item]:mx-2 [&_.ant-menu-item]:my-1 [&_.ant-menu-item]:rounded-lg [&_.ant-menu-item]:px-4 [&_.ant-menu-item]:py-3"
            } [&_.ant-menu-item]:text-sky-700 [&_.ant-menu-item]:font-medium [&_.ant-menu-item-selected]:bg-sky-100 [&_.ant-menu-item-selected]:text-sky-900 [&_.ant-menu-item-selected]:font-semibold [&_.ant-menu-item:hover]:bg-sky-50 [&_.ant-menu-item:hover]:text-sky-900`}
          style={{
            backgroundColor: "transparent",
            border: "none",
          }}
        />
      </div>

      {/* Footer - Version info when expanded */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sky-200">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-3 text-center shadow-sm">
            <span className="text-xs text-sky-600 font-medium block">Phiên bản</span>
            <span className="font-semibold text-sky-800 text-sm">v1.0.0</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiderRouteOption;
