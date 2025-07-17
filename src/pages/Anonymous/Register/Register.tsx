import { useState } from "react";
import EkycSDK from "../../../components/Ekyc/EkycSDK";
import { ConfigProvider, Steps } from "antd";
import RegisterAccountForm from "./components/RegisterAccountForm";

const Register = () => {
  const [current, setCurrent] = useState(0);
  const [account, setAccount] = useState({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8 animate-slide-in-up">
          <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <div className="bg-white px-6 py-2 rounded-xl">
              <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
                🏛️ ĐĂNG KÝ TÀI KHOẢN
              </span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Tạo tài khoản mới
          </h1>
        </div>

        {/* Enhanced Steps Progress */}
        <div className="mb-8 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
          <ConfigProvider
            theme={{
              components: {
                Steps: {
                  colorPrimary: "#3B82F6",
                  colorText: "#FFFFFF",
                  colorTextDescription: "#E2E8F0",
                  colorIcon: "#FFFFFF",
                  colorBorder: "#64748B",
                },
              },
            }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <Steps
                current={current}
                items={[
                  {
                    title: <span className="text-white font-semibold">Xác thực danh tính</span>,
                    description: <span className="text-blue-200">Quét CCCD và khuôn mặt</span>,
                    icon: (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          current >= 0 ? "bg-blue-500 text-white" : "bg-gray-400 text-gray-600"
                        }`}
                      >
                        🆔
                      </div>
                    ),
                  },
                  {
                    title: <span className="text-white font-semibold">Thông tin tài khoản</span>,
                    description: <span className="text-blue-200">Tạo mật khẩu và hoàn tất</span>,
                    icon: (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          current >= 1 ? "bg-blue-500 text-white" : "bg-gray-400 text-gray-600"
                        }`}
                      >
                        📝
                      </div>
                    ),
                  },
                ]}
                className="custom-steps"
              />
            </div>
          </ConfigProvider>
        </div>

        {/* Content Area */}
        <div className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
          {current === 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse-glow">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Xác thực danh tính</h2>
                  <p className="text-blue-200">
                    Vui lòng chuẩn bị CCCD và thực hiện quét theo hướng dẫn
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <EkycSDK
                    setCurrent={setCurrent}
                    setAccount={setAccount}
                    face={true}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {current === 1 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 animate-pulse-glow">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Hoàn tất thông tin tài khoản
                  </h2>
                  <p className="text-blue-200">Tạo mật khẩu và hoàn tất đăng ký</p>
                </div>

                <RegisterAccountForm account={account} user={true} />
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div
          className="flex justify-center mt-8 animate-slide-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex space-x-2">
            {[0, 1].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  step <= current
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 scale-110"
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
