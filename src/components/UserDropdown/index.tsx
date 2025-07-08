/* eslint-disable @typescript-eslint/no-explicit-any */
// components/UserDropdown.tsx
import {
  KeyOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

interface Props {
  onShowInfo: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

const UserDropdown: React.FC<Props> = ({
  onShowInfo,
  onChangePassword,
  onLogout,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !(ref.current as any).contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div ref={ref} className="relative group">
      <div
        className="w-9 h-9 rounded-full bg-sky-100 border-2 border-sky-500 flex items-center justify-center cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <UserOutlined style={{ fontSize: "1.4rem" }} />
      </div>

      <ul
        className={`absolute left-1/2 transform -translate-x-1/2 mt-3 z-30 ${
          open ? "flex" : "hidden"
        } lg:group-hover:flex flex-col w-56 bg-white border border-sky-200 shadow-xl rounded-xl overflow-hidden transition-all duration-200 ease-out`}
      >
        <li
          onClick={() => {
            onShowInfo();
            setOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-sky-50 hover:text-sky-600 transition-colors"
        >
          <UserOutlined />
          <span>Thông tin cá nhân</span>
        </li>
        <li
          onClick={() => {
            onChangePassword();
            setOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-sky-50 hover:text-sky-600 transition-colors"
        >
          <KeyOutlined />
          <span>Đổi mật khẩu</span>
        </li>
        <li className="border-t border-gray-100" />
        <li
          onClick={() => {
            onLogout();
            setOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors"
        >
          <LogoutOutlined />
          <span>Đăng xuất</span>
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown;
