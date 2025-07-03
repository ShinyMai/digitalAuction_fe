/* eslint-disable no-extra-boolean-cast */
import {
  DownOutlined,
  KeyOutlined,
  LogoutOutlined,
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

const Header = memo(() => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [changePassword, setChangePassword] =
    useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <div className="flex items-center justify-between w-full px-4 lg:px-12">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-12 sm:w-16 h-12 md:h-16 rounded-2xl"
        />
        <div className="hidden lg:flex flex-row items-center justify-center gap-5 mt-2 md:mt-0 ml-0 md:ml-8">
          <div
            className="cursor-pointer hover:scale-105"
            onClick={() => navigate("/")}
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
                Danh sách tài sản
                <DownOutlined />
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
        </div>
        <div className="flex items-center gap-2 ">
          {!!user ? (
            <div className="relative cursor-pointer group text-[#0085D2]">
              <div className="flex items-center gap-5">
                <div className="text-lg font-medium">
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
                  className="flex items-center gap-2 cursor-pointer hover:text-sky-500"
                >
                  <UserOutlined />
                  <p className="w-max">Thông tin cá nhân</p>
                </li>
                <hr />
                <li
                  onClick={() => setChangePassword(true)}
                  className="flex items-center gap-2 cursor-pointer hover:text-sky-500 h-5"
                >
                  <KeyOutlined />
                  <p className="">Đổi mật khẩu</p>
                </li>
                <hr />
                {/* {user?.role === "patient" && (
                  <>
                    <li className="flex items-center gap-2 hover:text-sky-500">
                      <ScheduleOutlined />
                      <Link
                        to="/lich-su-kham"
                        className="text-inherit no-underline"
                      >
                        <p className="w-max">
                          Lịch sử đặt khám
                        </p>
                      </Link>
                    </li>
                    <hr />
                    <li className="flex items-center gap-2 hover:text-sky-500">
                      <BookOutlined />
                      <Link
                        to="/ho-so-benh-an"
                        className="text-inherit no-underline"
                      >
                        <p className="w-max">
                          Hồ sơ bệnh án
                        </p>
                      </Link>
                    </li>
                    <hr />
                    <li className="flex items-center gap-2 hover:text-sky-500">
                      <QuestionCircleOutlined />
                      <Link
                        to="/hoi-dap"
                        className="text-inherit no-underline"
                      >
                        <p className="w-max">
                          Câu hỏi của tôi
                        </p>
                      </Link>
                    </li>
                    <hr />
                    <li className="flex items-center gap-2 hover:text-sky-500">
                      <ShopOutlined />
                      <Link
                        to="/san-pham"
                        className="text-inherit no-underline"
                      >
                        <p className="w-max">Hiệu thuốc</p>
                      </Link>
                    </li>
                    <hr />
                    <li className="flex items-center gap-2 hover:text-sky-500">
                      <ShoppingCartOutlined />
                      <Link
                        to="/lich-su-mua-hang"
                        className="text-inherit no-underline"
                      >
                        <p className="w-max">
                          Lịch sử mua hàng
                        </p>
                      </Link>
                    </li>
                    <hr />
                  </>
                )} */}
                <li
                  onClick={() => {
                    handleLogout();
                  }}
                  className="flex items-center gap-2 cursor-pointer hover:text-sky-500"
                >
                  <LogoutOutlined />
                  <p className="w-max">Đăng xuất</p>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="text-sm md:text-base font-bold text-black bg-white hover:bg-blue-100 px-2 py-1 rounded-lg cursor-pointer text-center hover:scale-105"
                onClick={() => setLogin(true)}
              >
                <UserOutlined className="mr-2" />
                Đăng nhập
              </div>
              <div
                className="text-sm md:text-base font-bold bg-white text-black hover:bg-blue-100 px-2 py-1 rounded-lg cursor-pointer text-center hover:scale-105"
                onClick={() => navigate("/register")}
              >
                <UserAddOutlined className="mr-2" />
                Đăng ký
              </div>
            </div>
          )}

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
    </div>
  );
});

export default Header;
