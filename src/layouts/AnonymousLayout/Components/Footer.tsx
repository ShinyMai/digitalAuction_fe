import { assets } from "../../../assets";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full animate-float"></div>
        <div
          className="absolute top-32 right-20 w-16 h-16 bg-purple-400 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-12 h-12 bg-yellow-400 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <img
                    src={assets.logo}
                    className="relative w-16 h-16 rounded-2xl ring-2 ring-white/30 hover:ring-white/50 transition-all duration-300"
                    alt="Digital Auction Logo"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Digital Auction
                  </h3>
                  <p className="text-blue-200 text-sm">Nền tảng đấu giá số hàng đầu</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-lg text-yellow-400 mb-4">
                  CÔNG TY HỢP DANH ĐẤU GIÁ TÀI SẢN SỐ VDA
                </h4>
                <div className="space-y-3 text-blue-100">
                  <div className="flex items-start gap-3 group hover:text-white transition-colors duration-300">
                    <EnvironmentOutlined className="text-yellow-400 mt-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm leading-relaxed">
                      Đại học FPT Hà Nội, Khu công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội
                    </span>
                  </div>
                  <div className="flex items-center gap-3 group hover:text-white transition-colors duration-300">
                    <PhoneOutlined className="text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm">0876126324</span>
                  </div>
                  <div className="flex items-center gap-3 group hover:text-white transition-colors duration-300">
                    <MailOutlined className="text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm">digitalAuction@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-bold text-lg text-yellow-400 border-b border-yellow-400/30 pb-2">
                Liên kết nhanh
              </h4>
              <ul className="space-y-3">
                {["Trang chủ", "Giới thiệu", "Danh sách đấu giá", "Tin tức", "Hướng dẫn"].map(
                  (link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-blue-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 bg-yellow-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="font-bold text-lg text-yellow-400 border-b border-yellow-400/30 pb-2">
                Dịch vụ
              </h4>
              <ul className="space-y-3">
                {[
                  "Đấu giá tài sản",
                  "Đăng ký tham gia",
                  "Hỗ trợ khách hàng",
                  "Tư vấn pháp lý",
                  "Định giá tài sản",
                ].map((service, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-blue-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-yellow-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Media */}
              <div className="flex items-center gap-4">
                <span className="text-blue-200 text-sm font-medium">Theo dõi chúng tôi:</span>
                <div className="flex gap-3">
                  {[
                    { icon: FacebookOutlined, color: "hover:bg-blue-600" },
                    { icon: TwitterOutlined, color: "hover:bg-sky-500" },
                    { icon: InstagramOutlined, color: "hover:bg-pink-600" },
                    { icon: LinkedinOutlined, color: "hover:bg-blue-700" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`w-10 h-10 bg-white/10 ${social.color} rounded-full flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm`}
                    >
                      <social.icon className="text-sm" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="flex items-center gap-3">
                <span className="text-blue-200 text-sm font-medium hidden md:block">
                  Đăng ký nhận tin:
                </span>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Email của bạn..."
                    className="px-4 py-2 rounded-l-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-yellow-400 transition-all duration-300"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-r-full font-semibold text-white transition-all duration-300 hover:scale-105">
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-200">
              <div className="flex items-center gap-4">
                <span>© 2024 Digital Auction VDA. Tất cả quyền được bảo lưu.</span>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Chính sách bảo mật
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Điều khoản sử dụng
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Liên hệ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
