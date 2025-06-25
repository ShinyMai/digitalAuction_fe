import { memo, useState } from "react";

import { useSelector } from "react-redux";
import {
  KeyOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile";

const HeaderCompany = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-[64px] w-full flex items-center justify-end bg-stone-300/30 px-4 md:px-8">
      <div className="relative cursor-pointer group text-[#0085D2]">
        <div className="flex items-center gap-5">
          <div className="text-lg font-medium text-[#0085D2]">
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
        <ul className="absolute right-0 z-10 hidden flex-col gap-2 bg-[#f2f8fa] p-3 border rounded border-[#bce6f7] outline-white group-hover:flex list-none">
          <li
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 cursor-pointer hover:text-sky-500 h-5"
          >
            <UserOutlined />
            <p className="">Thông tin cá nhân</p>
          </li>
          <hr />
          <li
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 cursor-pointer hover:text-sky-500 h-5"
          >
            <KeyOutlined />
            <p className="">Đổi mật khẩu</p>
          </li>
          <hr />
          <li
            onClick={() => {
              localStorage.removeItem("user");
              window.location.reload();
              window.location.pathname = "/"
              navigate("/");
            }}
            className="flex items-center gap-2 cursor-pointer hover:text-sky-500 h-5"
          >
            <LogoutOutlined />
            <p className="w-max">Đăng xuất</p>
          </li>
        </ul>
      </div>
      {showInfo && (
        <UserProfile
          open={showInfo}
          onCancel={() => setShowInfo(false)}
        />
      )}
    </div>
  );
});

export default HeaderCompany;
