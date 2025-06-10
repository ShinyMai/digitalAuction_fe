import {
  DownOutlined,
  MenuOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useState, useMemo, memo } from "react";
import { assets } from "../../assets";
import Register from "./Register";

const Header = memo(() => {
  const [register, setRegister] = useState<boolean>(false);
  console.log(register);

  const items = useMemo(
    () => [
      {
        key: "1",
        label: <a href="#">Tài sản đảm bảo</a>,
      },
      {
        key: "2",
        label: <a href="#">Quyền sử dụng đất</a>,
      },
      {
        key: "3",
        label: <a href="#">Tài sản vi phạm hành chính</a>,
      },
      {
        key: "4",
        label: <a href="#">Tài sản nhà nước</a>,
      },
      {
        key: "5",
        label: <a href="#">Tài sản khác</a>,
      },
    ],
    []
  );

  const items2 = useMemo(
    () => [
      {
        key: "1",
        label: "Trang chủ",
      },
      {
        key: "2",
        label: "Danh sách tài sản",
        children: [
          {
            key: "2-1",
            label: "Tài sản đảm bảo",
          },
          {
            key: "2-2",
            label: "Quyền sử dụng đất",
          },
          {
            key: "2-3",
            label: "Tài sản vi phạm hành chính",
          },
          {
            key: "2-4",
            label: "Tài sản nhà nước",
          },
          {
            key: "2-5",
            label: "Tài sản khác",
          },
        ],
      },
      {
        key: "3",
        label: "Tài sản Bộ Công an",
      },
      {
        key: "4",
        label: "Tài sản nhà đất",
      },
      {
        key: "5",
        label: "Phòng đấu giá",
      },
      {
        key: "6",
        label: "Kết quả đấu giả",
      },
      {
        key: "7",
        label: "Hướng dẫn",
      },
    ],
    []
  );

  return (
    <div className="min-h-18 border-2 rounded-t-lg bg-gradient-to-r from-sky-600 to-sky-400 text-white flex justify- sticky top-0 z-10">
      <div className="flex items-center justify-between w-full px-4 md:px-12">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-12 md:w-16 h-12 md:h-16 rounded-2xl"
        />
        <div className="hidden md:flex flex-row items-center justify-center gap-5 mt-2 md:mt-0 ml-0 md:ml-8">
          <div className="cursor-pointer hover:scale-105">
            Trang chủ
          </div>
          <Dropdown menu={{ items }}>
            <a
              onClick={(e) => e.preventDefault()}
              className="cursor-pointer hover:scale-105"
            >
              <Space>
                Danh sách tài sản
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          <div className="cursor-pointer hover:scale-105">
            Tài sản Bộ Công an
          </div>
          <div className="cursor-pointer hover:scale-105">
            Tài sản nhà đất
          </div>
          <div className="cursor-pointer hover:scale-105">
            Phòng đấu giá
          </div>
          <div className="cursor-pointer hover:scale-105">
            Kết quả đấu giả
          </div>
          <div className="cursor-pointer hover:scale-105">
            Hướng dẫn
          </div>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="text-sm md:text-base font-bold text-black bg-white hover:bg-blue-100 px-2 py-1 rounded-lg cursor-pointer text-center hover:scale-105">
            <UserOutlined className="mr-2" />
            Đăng nhập
          </div>
          <div
            className="text-sm md:text-base font-bold bg-white text-black hover:bg-blue-100 px-2 py-1 rounded-lg cursor-pointer text-center hover:scale-105"
            onClick={() => {
              setRegister(true);
            }}
          >
            <UserAddOutlined className="mr-2" />
            Đăng ký
          </div>
          <Dropdown
            menu={{
              items: items2,
            }}
            trigger={["click"]}
            className="lg:hidden"
          >
            <a
              onClick={(e) => e.preventDefault()}
              className="text-white"
            >
              <Space>
                <MenuOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>

      <Register
        open={register}
        onClose={() => {
          setRegister(false);
        }}
      />
    </div>
  );
});

export default Header;
