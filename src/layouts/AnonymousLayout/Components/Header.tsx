import { MenuOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { memo, useMemo, useState } from "react";
import { assets } from "../../../assets";
import { useNavigate } from "react-router-dom";
import Login from "../../../pages/Anonymous/Login/Login";
import { useSelector, useDispatch } from "react-redux";
import AuthServices from "../../../services/AuthServices";
import UserProfile from "../../../pages/User/UserProfile/UserProfile";
import ChangePassword from "../../../pages/User/UserProfile/EditAccount/ChangePassword";
import NotificationDropdown from "../../../components/Notification";
import UserDropdown from "../../../components/UserDropdown";
import { logout } from "../../../store/authReduxs/authSlice";
import type { RootState } from "../../../store/store";

const Header = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, setLogin] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      const res = await AuthServices.logout();
      if (res?.code === 200) {
        dispatch(logout());
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logout());
      navigate("/", { replace: true });
    }
  };
  const items2 = useMemo(
    () => [
      {
        key: "1",
        label: "Trang chủ",
      },
      { key: "2", label: "Giới thiệu" },
      { key: "3", label: "Kết quả đấu giả" },
      { key: "4", label: "Tin tức" },
      { key: "5", label: "Hướng dẫn" },
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
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl cursor-pointer"
          onClick={() => navigate("/")}
        />
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 font-medium">
          <div onClick={() => navigate("/")} className="cursor-pointer hover:scale-105">
            Trang chủ
          </div>
          <div className="cursor-pointer hover:scale-105" onClick={() => navigate("/introduction")}>
            Giới thiệu
          </div>
          <div className="cursor-pointer hover:scale-105">Kết quả đấu giả</div>
          <div className="cursor-pointer hover:scale-105">Tin tức</div>
          <div className="cursor-pointer hover:scale-105">Hướng dẫn</div>
        </nav>{" "}
        {/* Right Section: Auth or User Info */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3 text-[#0085D2]">
              <NotificationDropdown />
              <UserDropdown
                onShowInfo={() => setShowInfo(true)}
                onChangePassword={() => setChangePassword(true)}
                onLogout={handleLogout}
              />
              {/* Tên người dùng (ẩn trên mobile) */}
              <span className="hidden sm:inline-block font-medium text-white">{user?.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogin(true)}
                className="text-xs sm:text-sm font-bold text-black bg-white hover:bg-blue-100 px-2 py-1 rounded-lg cursor-pointer"
              >
                <UserOutlined className="mr-1" />
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-xs sm:text-sm font-bold bg-white text-black hover:bg-blue-100 px-2 py-1 rounded-lg cursor-pointer"
              >
                <UserAddOutlined className="mr-1 " />
                Đăng ký
              </button>
            </div>
          )}

          {/* Mobile Menu */}
          <Dropdown menu={{ items: items2 }} trigger={["click"]} className="lg:hidden">
            <a onClick={(e) => e.preventDefault()} className="text-white ml-2">
              <MenuOutlined className="text-lg" />
            </a>
          </Dropdown>
        </div>
      </div>

      {/* Modals */}
      {login && <Login open={login} onCancel={() => setLogin(false)} />}
      {showInfo && <UserProfile open={showInfo} onCancel={() => setShowInfo(false)} />}
      {changePassword && (
        <ChangePassword open={changePassword} onCancel={() => setChangePassword(false)} />
      )}
    </header>
  );
});

export default Header;
