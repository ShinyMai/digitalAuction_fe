/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChartOutlined,
  TeamOutlined,
  UserAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  FormOutlined,
  PieChartOutlined,
  LineChartOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  ClockCircleOutlined,
  FileAddOutlined,
  CalendarOutlined,
  StopOutlined,
  HistoryOutlined,
  CustomerServiceOutlined,
  ContactsOutlined,
  UserOutlined,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu, type MenuProps, Button, Tooltip } from "antd";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ADMIN_ROUTES, AUCTIONEER_ROUTES, MANAGER_ROUTES, STAFF_ROUTES } from "../../../routers";
import { assets } from "../../../assets";

interface MenuItem {
  key: string;
  icon?: React.ReactElement;
  label: string;
  url?: string;
  roleView: string[];
  children?: MenuItem[];
  type?: 'group';
}

const items: MenuItem[] = [
  {
    key: "dashboard",
    icon: <BarChartOutlined className="text-xl" />,
    label: "Dashboard & Thống kê",
    roleView: ["Manager", "Director", "Admin", "Auctioneer"],
    children: [
      {
        key: "1",
        icon: <PieChartOutlined />,
        label: "Thống kê tổng quan",
        url: STAFF_ROUTES.SUB.STATISTICS,
        roleView: ["Manager", "Director", "Admin"],
      },
      {
        key: "11",
        icon: <LineChartOutlined />,
        label: "Báo cáo & Thống kê",
        url: AUCTIONEER_ROUTES.SUB.REPORTS,
        roleView: ["Auctioneer"],
      },
      {
        key: "12",
        icon: <DashboardOutlined />,
        label: "Dashboard ( Chưa API )",
        url: AUCTIONEER_ROUTES.SUB.DASHBOARD,
        roleView: ["Auctioneer"],
      },
    ],
  },
  {
    key: "auction-management",
    icon: <SolutionOutlined className="text-xl" />,
    label: "Quản lý đấu giá",
    roleView: ["Staff", "Manager", "Director", "Auctioneer"],
    children: [
      {
        key: "2",
        icon: <FileSearchOutlined />,
        label: "Đang thu hồ sơ",
        url: STAFF_ROUTES.SUB.AUCTION_LIST,
        roleView: ["Staff", "Director", "Manager"],
      },
      {
        key: "3",
        icon: <ClockCircleOutlined />,
        label: "Đợi duyệt",
        url: MANAGER_ROUTES.SUB.AUCTION_LIST_WAITING_PUBLIC,
        roleView: ["Manager"],
      },
      {
        key: "4",
        icon: <FileAddOutlined />,
        label: "Tạo phiên đấu giá",
        url: STAFF_ROUTES.SUB.POST_AUCTION,
        roleView: ["Staff"],
      },
      {
        key: "8",
        icon: <CalendarOutlined />,
        label: "Tổ chức hôm nay",
        url: AUCTIONEER_ROUTES.SUB.AUCTION_NOW,
        roleView: ["Manager", "Staff", "Auctioneer"],
      },
      {
        key: "9",
        icon: <StopOutlined />,
        label: "Đã hủy",
        url: MANAGER_ROUTES.SUB.AUCTION_LIST_CANCEL,
        roleView: ["Manager", "Staff"],
      },
      {
        key: "10",
        icon: <HistoryOutlined />,
        label: "Phiên đấu giá đã tham gia",
        url: AUCTIONEER_ROUTES.SUB.LIST_AUCTION_ASSIGNED,
        roleView: ["Auctioneer"],
      },
      {
        key: "10",
        icon: <HistoryOutlined />,
        label: "Bản nháp đấu giá",
        url: STAFF_ROUTES.SUB.AUCTION_LIST_DRAFF,
        roleView: ["Staff"],
      },
    ],
  },
  {
    key: "support-management",
    icon: <TeamOutlined className="text-xl" />,
    label: "Hỗ trợ & Dịch vụ",
    roleView: ["Staff"],
    children: [
      {
        key: "5",
        icon: <CustomerServiceOutlined />,
        label: "Hỗ trợ đăng ký tham gia đấu giá",
        url: STAFF_ROUTES.SUB.SUPPORT_REGISTER_AUCTION,
        roleView: ["Staff"],
      },
    ],
  },
  {
    key: "user-management",
    icon: <UserAddOutlined className="text-xl" />,
    label: "Quản lý người dùng",
    roleView: ["Director", "Manager", "Admin"],
    children: [
      {
        key: "6",
        icon: <ContactsOutlined />,
        label: "Quản lý nhân sự",
        url: STAFF_ROUTES.SUB.PROPERTIES,
        roleView: ["Director", "Manager"],
      },
      {
        key: "7",
        icon: <UserOutlined />,
        label: "Tạo tài khoản mới",
        url: ADMIN_ROUTES.SUB.ADD_EMPLOYEES,
        roleView: ["Admin"],
      },
    ],
  },
  {
    key: "content-management",
    icon: <FormOutlined className="text-xl" />,
    label: "Quản lý nội dung",
    roleView: ["Staff", "Manager"],
    children: [
      {
        key: "13",
        icon: <EditOutlined />,
        label: "Quản lý tin tức (Staff)",
        url: STAFF_ROUTES.SUB.LIST_BLOG,
        roleView: ["Staff"],
      },
      {
        key: "14",
        icon: <SettingOutlined />,
        label: "Quản lý tin tức (Manager)",
        url: MANAGER_ROUTES.SUB.LIST_BLOG,
        roleView: ["Manager"],
      },
    ],
  },
];

interface SiderRouteOptionProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const SiderRouteOption = ({ collapsed = false, onCollapse }: SiderRouteOptionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;

  const filteredItems = useMemo(() => {
    const filterMenuItems = (menuItems: MenuItem[]): MenuItem[] => {
      return menuItems
        .map((item) => {
          if (item.children) {
            // Filter children based on role
            const filteredChildren = item.children.filter((child) =>
              role && child.roleView.includes(role)
            );

            // Only include parent if it has visible children or if user has permission
            if (filteredChildren.length > 0 && item.roleView.includes(role || '')) {
              return {
                ...item,
                children: filteredChildren,
              };
            }
            return null;
          } else {
            // For items without children, check role permission
            return role && item.roleView.includes(role) ? item : null;
          }
        })
        .filter((item): item is MenuItem => item !== null);
    };

    return filterMenuItems(items);
  }, [role]);

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    onCollapse?.(newCollapsed);
  };

  const getCurrentKey = () => {
    const pathname = location.pathname;
    const rolePath = role?.toLowerCase();
    const routeWithoutRole = pathname.replace(`/${rolePath}/`, "");

    // Find current key in nested structure
    let currentKey = "";

    const findKeyInItems = (menuItems: MenuItem[]): string => {
      for (const item of menuItems) {
        if (item.children) {
          for (const child of item.children) {
            if (child.url && (routeWithoutRole === child.url || routeWithoutRole.startsWith(child.url))) {
              return child.key;
            }
          }
        } else if (item.url && (routeWithoutRole === item.url || routeWithoutRole.startsWith(item.url))) {
          return item.key;
        }
      }
      return "";
    };

    currentKey = findKeyInItems(filteredItems);

    // Fallback to first available item
    if (!currentKey) {
      const firstItem = filteredItems[0];
      if (firstItem?.children && firstItem.children.length > 0) {
        currentKey = firstItem.children[0].key;
      } else if (firstItem) {
        currentKey = firstItem.key;
      }
    }

    return currentKey;
  };

  const onClick: MenuProps["onClick"] = (e) => {
    // Find the clicked item in nested structure
    const findItemByKey = (menuItems: MenuItem[], key: string): MenuItem | null => {
      for (const item of menuItems) {
        if (item.key === key) {
          return item;
        }
        if (item.children) {
          for (const child of item.children) {
            if (child.key === key) {
              return child;
            }
          }
        }
      }
      return null;
    };

    const item = findItemByKey(filteredItems, e.key);

    if (item && item.url) {
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
          defaultOpenKeys={filteredItems.map((item) => item.key)}
          inlineCollapsed={collapsed}
          items={filteredItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: collapsed ? null : item.label,
            title: collapsed ? item.label : undefined,
            children: item.children
              ? item.children.map((child) => ({
                key: child.key,
                icon: child.icon,
                label: child.label,
                title: collapsed ? child.label : undefined,
              }))
              : undefined,
          }))}
          className={`w-full bg-transparent border-none transition-all duration-300 ${collapsed
            ? "[&_.ant-menu-item]:mx-1 [&_.ant-menu-item]:my-2 [&_.ant-menu-item]:rounded-xl [&_.ant-menu-item]:px-3 [&_.ant-menu-item]:py-4"
            : "[&_.ant-menu-item]:mx-2 [&_.ant-menu-item]:my-1 [&_.ant-menu-item]:rounded-lg [&_.ant-menu-item]:px-4 [&_.ant-menu-item]:py-3"
            } [&_.ant-menu-item]:text-sky-700 [&_.ant-menu-item]:font-medium [&_.ant-menu-item-selected]:bg-sky-100 [&_.ant-menu-item-selected]:text-sky-900 [&_.ant-menu-item-selected]:font-semibold [&_.ant-menu-item:hover]:bg-sky-50 [&_.ant-menu-item:hover]:text-sky-900 [&_.ant-menu-submenu-title]:text-sky-800 [&_.ant-menu-submenu-title]:font-semibold [&_.ant-menu-submenu-title:hover]:bg-sky-50 [&_.ant-menu-submenu-title:hover]:text-sky-900`}
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
