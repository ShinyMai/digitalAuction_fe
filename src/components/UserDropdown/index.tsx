/* eslint-disable @typescript-eslint/no-explicit-any */
// components/UserDropdown.tsx
import {
  KeyOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface Props {
  onShowInfo: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

const UserDropdown: React.FC<Props> = ({ onShowInfo, onChangePassword, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !(ref.current as any).contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "from-red-500 to-pink-600";
      case "manager":
        return "from-purple-500 to-indigo-600";
      case "staff":
        return "from-blue-500 to-cyan-600";
      case "auctioneer":
        return "from-green-500 to-emerald-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <CrownOutlined className="text-red-500" />;
      case "manager":
        return <SettingOutlined className="text-purple-500" />;
      case "staff":
        return <UserOutlined className="text-blue-500" />;
      case "auctioneer":
        return <CrownOutlined className="text-green-500" />;
      default:
        return <UserOutlined className="text-gray-500" />;
    }
  };

  return (
    <div ref={ref} className="relative group">
      {/* Enhanced User Avatar */}
      <div
        className={`relative w-10 h-10 rounded-full bg-gradient-to-r ${getRoleColor(
          user?.roleName || ""
        )} hover:scale-110 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg group-hover:shadow-xl`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <UserOutlined className="text-lg text-white" />

        {/* Online Status Indicator */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Enhanced Dropdown Menu */}
      <div
        className={`absolute right-0 mt-3 z-50 ${
          open ? "block" : "hidden"
        } w-72 bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 transform ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* User Info Header */}
        <div
          className={`bg-gradient-to-r ${getRoleColor(
            user?.roleName || ""
          )} p-4 relative overflow-hidden`}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-4 -translate-x-4"></div>

          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UserOutlined className="text-white text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base truncate">
                {user?.name || "Người dùng"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {getRoleIcon(user?.roleName || "")}
                <span className="text-white/90 text-sm font-medium">
                  {user?.roleName || "Khách"}
                </span>
              </div>
              {user?.email && <p className="text-white/70 text-xs mt-1 truncate">{user.email}</p>}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <div
            onClick={() => {
              onShowInfo();
              setOpen(false);
            }}
            className="group flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UserOutlined className="text-blue-600" />
            </div>
            <div className="relative">
              <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Thông tin cá nhân
              </p>
              <p className="text-xs text-gray-500">Xem và chỉnh sửa hồ sơ</p>
            </div>
          </div>

          <div
            onClick={() => {
              onChangePassword();
              setOpen(false);
            }}
            className="group flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-purple-50 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <KeyOutlined className="text-purple-600" />
            </div>
            <div className="relative">
              <p className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                Đổi mật khẩu
              </p>
              <p className="text-xs text-gray-500">Bảo mật tài khoản</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-2 mx-4 border-t border-gray-100"></div>

          <div
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="group flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-red-50 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <LogoutOutlined className="text-red-600" />
            </div>
            <div className="relative">
              <p className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                Đăng xuất
              </p>
              <p className="text-xs text-gray-500">Thoát khỏi tài khoản</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm p-3">
          <div className="text-center text-xs text-gray-500">
            <span className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
