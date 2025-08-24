import { Link } from "react-router-dom";

const Introduction = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="flex items-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 max-w-2xl text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              CHÀO MỪNG ĐẾN VỚI {""}
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-extrabold">
                TUẤN LINH DIGITAL AUCTION
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 leading-relaxed">
              Hệ thống đăng ký tham gia đấu giá Tuấn Linh - Kết nối bạn với các
              phiên đấu giá chính thức
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-sm sm:text-base"
              >
                Bắt đầu ngay
              </Link>
              <Link
                to="/auction-list"
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
              >
                Xem danh sách đấu giá
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:pl-4 order-1 lg:order-2 mt-8 lg:mt-0">
            <div className="relative">
              <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 animate-bounce">
                🏛️
              </div>
              <div className="absolute -top-1 sm:-top-2 -right-4 sm:-right-6 text-xl sm:text-2xl md:text-3xl animate-pulse delay-300">
                🎨
              </div>
              <div className="absolute -bottom-1 sm:-bottom-2 -left-3 sm:-left-4 text-xl sm:text-2xl md:text-3xl animate-pulse delay-500">
                ⚡
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-10 lg:mb-12 text-gray-800">
            Tại sao chọn Digital Auction?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔒</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                Bảo mật tuyệt đối
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Hệ thống bảo mật tiên tiến, đảm bảo mọi giao dịch an toàn và
                minh bạch
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">⚡</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                Đăng ký nhanh chóng
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Đăng ký tham gia đấu giá trực tuyến một cách nhanh chóng và
                thuận tiện
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🌟</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                Đa dạng sản phẩm
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Từ nghệ thuật, đồ cổ đến hàng hiệu - tất cả đều có tại Digital
                Auction
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🏆</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                Uy tín hàng đầu
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Được tin tưởng bởi hàng nghìn người dùng và đối tác trên toàn
                quốc
              </p>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* How it works Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-10 lg:mb-12 text-gray-800">
            Cách thức hoạt động
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-sky-600 to-sky-500 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">
                Đăng ký tài khoản
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Tạo tài khoản miễn phí và xác thực thông tin cá nhân
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-sky-600 to-sky-500 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">
                Tìm kiếm sản phẩm
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Duyệt qua hàng nghìn sản phẩm đang được đấu giá
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-sky-600 to-sky-500 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">
                Đăng ký tham gia
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Đăng ký tham gia phiên đấu giá và chuẩn bị hồ sơ cần thiết
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-sky-600 to-sky-500 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">
                Tham dự đấu giá
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Tham dự phiên đấu giá trực tiếp tại địa điểm được thông báo
              </p>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Sẵn sàng bắt đầu hành trình đấu giá?
          </h2>
          <Link
            to="/register"
            className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white font-bold text-base sm:text-lg rounded-full transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
          >
            Đăng ký miễn phí
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Introduction;
