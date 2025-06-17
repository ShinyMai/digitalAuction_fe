import { DownOutlined, LogoutOutlined, MenuOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { memo, useMemo, useState } from "react";
import { assets } from "../../../assets";
import { useNavigate } from "react-router-dom";
import Login from "../../../pages/Anonymous/Login/Login";
import { useSelector } from "react-redux";

const HeaderAnonymous = memo(() => {
    const navigate = useNavigate();
    const [login, setLogin] = useState(false);
    const { user } = useSelector((state: any) => state.auth);

    const items = useMemo(
        () => [
            {
                key: "1",
                label: "Tài sản đảm bảo",
                onClick: () => navigate("/auction-list"),
            },
            {
                key: "2",
                label: "Quyền sử dụng đất",
                onClick: () => navigate("/auction-list"),
            },
            {
                key: "3",
                label: "Tài sản vi phạm hành chính",
                onClick: () => navigate("/auction-list"),
            },
            {
                key: "4",
                label: "Tài sản nhà nước",
                onClick: () => navigate("/auction-list"),
            },
            {
                key: "5",
                label: "Tài sản khác",
                onClick: () => navigate("/auction-list"),
            },
        ],
        [navigate]
    );

    const items2 = useMemo(
        () => [
            {
                key: "1",
                label: "Trang chủ",
                onClick: () => navigate("/"),
            },
            {
                key: "2",
                label: "Danh sách tài sản",
                children: [
                    {
                        key: "2-1",
                        label: "Tài sản đảm bảo",
                        onClick: () => navigate("/auction-list"),
                    },
                    {
                        key: "2-2",
                        label: "Quyền sử dụng đất",
                        onClick: () => navigate("/auction-list"),
                    },
                    {
                        key: "2-3",
                        label: "Tài sản vi phạm hành chính",
                        onClick: () => navigate("/auction-list"),
                    },
                    {
                        key: "2-4",
                        label: "Tài sản nhà nước",
                        onClick: () => navigate("/auction-list"),
                    },
                    {
                        key: "2-5",
                        label: "Tài sản khác",
                        onClick: () => navigate("/auction-list"),
                    },
                ],
            },
            {
                key: "3",
                label: "Tài sản Bộ Công an",
                onClick: () => navigate("/auction-list"),
            },
            {
                key: "4",
                label: "Tài sản nhà đất",
                onClick: () => navigate("/auction-list"),
            },
            {
                key: "5",
                label: "Phòng đấu giá",
                onClick: () => navigate("/auction-list"),
            },
            {
                key: "6",
                label: "Kết quả đấu giá",
                onClick: () => navigate("/auction-list"),
            },
            {
                key: "7",
                label: "Hướng dẫn",
                onClick: () => navigate("/auction-list"),
            },
        ],
        [navigate]
    );

    return (
        <div className="min-h-18 border-2 rounded-t-lg bg-gradient-to-r from-sky-600 to-sky-400 text-white flex justify-center sticky top-0 z-10">
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
                        <div
                            onClick={(e) => e.preventDefault()}
                            className="cursor-pointer hover:scale-105"
                        >
                            <Space>
                                Danh sách tài sản
                                <DownOutlined />
                            </Space>
                        </div>
                    </Dropdown>
                    <div
                        className="cursor-pointer hover:scale-105"
                        onClick={() => navigate("/auction-list")}
                    >
                        Tài sản nhà đất
                    </div>
                    <div
                        className="cursor-pointer hover:scale-105"
                        onClick={() => navigate("/auction-list")}
                    >
                        Kết quả đấu giá
                    </div>
                    <div className="cursor-pointer hover:scale-105">
                        Tin tức
                    </div>
                    <div
                        className="cursor-pointer hover:scale-105"
                        onClick={() => navigate("/auction-list")}
                    >
                        Hướng dẫn
                    </div>
                </div>
                <div className="flex items-center gap-2">
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
                                    className="flex items-center gap-2 cursor-pointer hover:text-sky-500"
                                    onClick={() => navigate("/profile")}
                                >
                                    <UserOutlined />
                                    <p className="w-max">Thông tin cá nhân</p>
                                </li>
                                <hr />
                                <li
                                    className="flex items-center gap-2 cursor-pointer hover:text-sky-500"
                                    onClick={() => navigate("/logout")}
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
                        <div
                            onClick={(e) => e.preventDefault()}
                            className="text-white"
                        >
                            <Space>
                                <MenuOutlined />
                            </Space>
                        </div>
                    </Dropdown>
                </div>
            </div>
            {login && (
                <Login
                    open={login}
                    onCancel={() => setLogin(false)}
                />
            )}
        </div>
    );
});

export default HeaderAnonymous;