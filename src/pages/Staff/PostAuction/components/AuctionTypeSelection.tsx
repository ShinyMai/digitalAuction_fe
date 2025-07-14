import React from "react";

interface AuctionTypeSelectionProps {
  onSelect: (type: "NODE" | "SQL") => void;
}

const AuctionTypeSelection: React.FC<AuctionTypeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="w-full flex items-center justify-center bg-white py-4 sm:py-6 md:py-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text mb-8 text-center">
          Tạo Đấu Giá Mới
        </h1>{" "}
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 mb-4">Chọn loại đấu giá</p>
          <p className="text-sm text-gray-500">
            Bạn có thể lựa chọn giữa đấu giá từng tài sản hoặc đấu giá theo lô.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Đấu giá từng tài sản */}
          <div className="group">
            <button
              onClick={() => onSelect("SQL")}
              className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Đấu giá từng tài sản</h3>
                <p className="text-sm text-blue-600 text-center leading-relaxed">
                  Đấu giá riêng lẻ cho từng tài sản độc lập
                </p>
              </div>
            </button>
          </div>

          {/* Đấu giá theo lô */}
          <div className="group">
            <button
              onClick={() => onSelect("NODE")}
              className="w-full h-64 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-green-300 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200"
            >
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">Đấu giá theo lô</h3>
                <p className="text-sm text-green-600 text-center leading-relaxed">
                  Đấu giá nhiều tài sản cùng lúc trong một lô
                </p>
              </div>
            </button>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">Chọn phương thức phù hợp với nhu cầu của bạn</p>
        </div>
      </div>
    </div>
  );
};

export default AuctionTypeSelection;
