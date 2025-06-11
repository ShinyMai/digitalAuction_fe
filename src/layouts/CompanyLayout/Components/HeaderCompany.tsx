import { memo } from "react";
import { assets } from "../../../assets";

const HeaderCompany = memo(() => {
  return (
    <div className="min-h-[64px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-12 h-12 rounded-xl border-2 border-white/20"
        />
        {/* <div className="hidden lg:flex items-center space-x-6">
                    <a href="/statistics" className="text-white hover:text-blue-200 transition-transform hover:scale-105">
                        Thống kê
                    </a>
                    <a href="/auctions" className="text-white hover:text-blue-200 transition-transform hover:scale-105">
                        Danh sách các buổi đấu giá
                    </a>
                    <a href="/properties" className="text-white hover:text-blue-200 transition-transform hover:scale-105">
                        Danh sách bất động sản đấu giá
                    </a>
                    <a href="/personnel" className="text-white hover:text-blue-200 transition-transform hover:scale-105">
                        Danh sách nhân lực
                    </a>
                </div> */}
      </div>
      {/* <div className="flex items-center space-x-3">
                <Button
                    type="primary"
                    icon={<UserOutlined />}
                    className="bg-white text-blue-600 hover:bg-blue-100 font-semibold"
                    onClick={() => console.log("Login clicked")}
                >
                    Đăng nhập
                </Button>
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    className="bg-white text-blue-600 hover:bg-blue-100 font-semibold"
                    onClick={() => setRegister(true)}
                >
                    Đăng ký
                </Button>
                <Dropdown
                    menu={{ items }}
                    trigger={["click"]}
                    className="lg:hidden"
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <MenuOutlined className="text-white text-lg" />
                        </Space>
                    </a>
                </Dropdown>
            </div> */}
    </div>
  );
});

export default HeaderCompany;
