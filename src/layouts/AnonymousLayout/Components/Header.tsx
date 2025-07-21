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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 backdrop-blur-lg border-b border-white/20 shadow-xl">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>

      <div className="relative flex items-center justify-between px-4 py-4 md:px-6 lg:px-12">
        {/* Enhanced Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => navigate("/")}>
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            <img
              src={assets.logo}
              alt="Digital Auction Logo"
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-300 hover:scale-110 animate-float"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-white gradient-text bg-gradient-to-r from-white to-blue-100 bg-clip-text">
              Digital Auction
            </h1>
            <p className="text-xs text-blue-100 opacity-80">Nền tảng đấu giá số #1</p>
          </div>
        </div>

        {/* Enhanced Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 font-medium">
          {[
            { label: "Trang chủ", path: "/" },
            { label: "Giới thiệu", path: "/introduction" },
            { label: "Kết quả đấu giá", path: "/auction-results" },
            { label: "Tin tức", path: "/news" },
            { label: "Hướng dẫn", path: "/guidance" },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="relative group cursor-pointer px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-105"
            >
              <span className="text-white/90 group-hover:text-white transition-colors duration-300">
                {item.label}
              </span>
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
            </div>
          ))}
        </nav>

        {/* Enhanced Right Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Enhanced Notification */}
              <div className="relative">
                <NotificationDropdown />
              </div>

              {/* Enhanced User Dropdown */}
              <div className="relative">
                <UserDropdown
                  onShowInfo={() => setShowInfo(true)}
                  onChangePassword={() => setChangePassword(true)}
                  onLogout={handleLogout}
                />
              </div>

              {/* Enhanced User Name Display */}
              <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium text-white text-sm">{user?.name}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Enhanced Login Button */}
              <button
                onClick={() => setLogin(true)}
                className="group relative px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-sm group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm">Đăng nhập</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Enhanced Register Button */}
              <button
                onClick={() => navigate("/register")}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 glow-button"
              >
                <div className="flex items-center gap-2">
                  <UserAddOutlined className="text-sm group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm">Đăng ký</span>
                </div>
              </button>
            </div>
          )}

          {/* Enhanced Mobile Menu */}
          <Dropdown
            menu={{
              items: items2.map((item) => ({
                ...item,
                className: "hover:bg-blue-50 rounded-lg transition-colors duration-200",
              })),
            }}
            trigger={["click"]}
            className="lg:hidden"
            dropdownRender={(menu) => (
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                {menu}
              </div>
            )}
          >
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110">
              <MenuOutlined className="text-lg text-white" />
            </button>
          </Dropdown>
        </div>
      </div>

      {/* Enhanced Modals */}
      {login && <Login open={login} onCancel={() => setLogin(false)} />}
      {showInfo && <UserProfile open={showInfo} onCancel={() => setShowInfo(false)} />}
      {changePassword && (
        <ChangePassword open={changePassword} onCancel={() => setChangePassword(false)} />
      )}
    </header>
  );
});

export default Header;
