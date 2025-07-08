/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-extra-boolean-cast */
import {
  DownOutlined,
  MenuOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { memo, useMemo, useState } from "react";
import { assets } from "../../../assets";
import { useNavigate } from "react-router-dom";
import Login from "../../../pages/Anonymous/Login/Login";
import { useSelector } from "react-redux";
import AuthServices from "../../../services/AuthServices";
import UserProfile from "../../../pages/User/UserProfile/UserProfile";
import ChangePassword from "../../../pages/User/UserProfile/EditAccount/ChangePassword";
import NotificationDropdown from "../../../components/Notification";
import UserDropdown from "../../../components/UserDropdown";

const Header = memo(() => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [changePassword, setChangePassword] =
    useState(false);

  const { user } = useSelector((state: any) => state.auth);

  const handleLogout = async () => {
    try {
      const res = await AuthServices.logout();
      if (res?.code === 200) {
        localStorage.removeItem("user");
        window.location.reload();
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const items = useMemo(
    () => [
      { key: "1", label: <a href="#">Tài sản đảm bảo</a> },
      {
        key: "2",
        label: <a href="#">Quyền sử dụng đất</a>,
      },
      {
        key: "3",
        label: <a href="#">Tài sản vi phạm hành chính</a>,
      },
      { key: "4", label: <a href="#">Tài sản nhà nước</a> },
      { key: "5", label: <a href="#">Tài sản khác</a> },
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
          { key: "2-1", label: "Tài sản đảm bảo" },
          { key: "2-2", label: "Quyền sử dụng đất" },
          {
            key: "2-3",
            label: "Tài sản vi phạm hành chính",
          },
          { key: "2-4", label: "Tài sản nhà nước" },
          { key: "2-5", label: "Tài sản khác" },
        ],
      },
      { key: "3", label: "Tài sản Bộ Công an" },
      { key: "4", label: "Tài sản nhà đất" },
      { key: "5", label: "Phòng đấu giá" },
      { key: "6", label: "Kết quả đấu giả" },
      { key: "7", label: "Hướng dẫn" },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-sky-600 to-sky-400 text-white border-b border-sky-300 shadow-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 lg:px-12">
        {/* Logo */}
        <img
          src={assets.logo}
          alt="Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl"
        />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 font-medium">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer hover:scale-105"
          >
            Trang chủ
          </div>
          <div className="cursor-pointer hover:scale-105">
            Giới thiệu
          </div>
          <Dropdown menu={{ items }}>
            <a
              onClick={(e) => e.preventDefault()}
              className="cursor-pointer hover:scale-105"
            >
              <Space>
                Danh sách tài sản <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          <div className="cursor-pointer hover:scale-105">
            Tài sản nhà đất
          </div>
          <div className="cursor-pointer hover:scale-105">
            Kết quả đấu giả
          </div>
          <div className="cursor-pointer hover:scale-105">
            Tin tức
          </div>
          <div className="cursor-pointer hover:scale-105">
            Hướng dẫn
          </div>
        </nav>

        {/* Right Section: Auth or User Info */}
        <div className="flex items-center gap-2">
          {!!user ? (
            <div className="flex items-center gap-3 text-[#0085D2]">
              <NotificationDropdown />
              <UserDropdown
                onShowInfo={() => setShowInfo(true)}
                onChangePassword={() =>
                  setChangePassword(true)
                }
                onLogout={handleLogout}
              />
              {/* Tên người dùng (ẩn trên mobile) */}
              <span className="hidden sm:inline-block font-medium text-white">
                {user?.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogin(true)}
                className="text-xs sm:text-sm font-bold text-black bg-white hover:bg-blue-100 px-2 py-1 rounded-lg"
              >
                <UserOutlined className="mr-1" />
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-xs sm:text-sm font-bold bg-white text-black hover:bg-blue-100 px-2 py-1 rounded-lg"
              >
                <UserAddOutlined className="mr-1" />
                Đăng ký
              </button>
            </div>
          )}

          {/* Mobile Menu */}
          <Dropdown
            menu={{ items: items2 }}
            trigger={["click"]}
            className="lg:hidden"
          >
            <a
              onClick={(e) => e.preventDefault()}
              className="text-white ml-2"
            >
              <MenuOutlined className="text-lg" />
            </a>
          </Dropdown>
        </div>
      </div>

      {/* Modals */}
      {login && (
        <Login
          open={login}
          onCancel={() => setLogin(false)}
        />
      )}
      {showInfo && (
        <UserProfile
          open={showInfo}
          onCancel={() => setShowInfo(false)}
        />
      )}
      {changePassword && (
        <ChangePassword
          open={changePassword}
          onCancel={() => setChangePassword(false)}
        />
      )}
    </header>
  );
});

export default Header;
