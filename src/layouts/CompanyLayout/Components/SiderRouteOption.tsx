import {
  BarChartOutlined,
  ScheduleOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface MenuItem {
  key: string;
  icon: React.ReactElement;
  label: string;
  url: string;
}

const items: MenuItem[] = [
  {
    key: "1",
    icon: <BarChartOutlined />,
    label: "Thống kê",
    url: "statistics",
  },
  {
    key: "2",
    icon: <ScheduleOutlined />,
    label: "Danh sách các buổi đấu giá",
    url: "auction-list",
  },
  {
    key: "3",
    icon: <HomeOutlined />,
    label: "Danh sách bất động sản đấu giá",
    url: "properties",
  },
  {
    key: "4",
    icon: <TeamOutlined />,
    label: "Danh sách nhân lực",
    url: "personnel",
  },
].map((item) => ({
  ...item,
  icon: React.createElement(item.icon.type),
}));

const SiderRouteOption = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentKey = () => {
    const pathname = location.pathname;
    const currentItem = items.find((item) =>
      pathname.includes(item.url)
    );
    return currentItem ? currentItem.key : "1";
  };

  const onClick: MenuProps["onClick"] = (e) => {
    const item = items.find((i) => i.key === e.key);
    if (item) {
      console.log(`/admin/${item.url}`);
      navigate(`/admin/${item.url}`, { replace: true });
    }
  };

  return (
    <div className="w-full h-full flex justify-center pt-6 bg-slate-50">
      <div className="w-full">
        {" "}
        <Menu
          onClick={onClick}
          theme="light"
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          items={items as MenuProps["items"]}
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
