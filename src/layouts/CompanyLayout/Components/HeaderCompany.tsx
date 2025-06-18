import { memo } from "react";
import { assets } from "../../../assets";
import { useSelector } from "react-redux";
import {
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const HeaderCompany = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="min-h-[64px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-12 h-12 rounded-xl border-2 border-white/20"
        />
      </div>

      <div className="relative cursor-pointer group text-[#0085D2]">
        <div className="flex items-center gap-5">
          <div className="text-lg font-medium text-white">
            {user?.name}
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-sky-500 bg-sky-100 flex items-center justify-center">
            <UserOutlined
              style={{
                fontSize: "1.6rem",
                color: "#0085D2",
              }}
            />
          </div>
        </div>
        <ul className="absolute right-0 z-10 bg-[#f2f8fa] p-3 border rounded border-[#bce6f7] outline-white">
          <li
            // onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 cursor-pointer hover:text-sky-500 h-10"
          >
            <UserOutlined />
            <p className="">Thông tin cá nhân</p>
          </li>
          <hr />
          <li
            onClick={() => {
              localStorage.removeItem("user");
              window.location.reload();
              navigate("/");
            }}
            className="flex items-center gap-2 cursor-pointer hover:text-sky-500 h-10"
          >
            <LogoutOutlined />
            <p className="w-max">Đăng xuất</p>
          </li>
        </ul>
      </div>
    </div>
  );
});

export default HeaderCompany;
