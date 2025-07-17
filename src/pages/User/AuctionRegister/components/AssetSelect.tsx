import { useState } from "react";
import { Tooltip, Pagination, Button } from "antd";
import {
  TagOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  DollarOutlined,
  WalletOutlined,
  CreditCardOutlined,
  PictureOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
  StarOutlined,
  FireOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

interface Props {
  listAsset?: DataType[];
  onGetAssetSelect: (value: string) => void;
  onNext: (assetId: string) => void;
  onPrev: () => void;
}

interface DataType {
  auctionAssetsId: string;
  tagName: string;
  startingPrice: string;
  unit: string;
  deposit: string;
  registrationFee: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  auctionId: string;
  auction?: string;
  imageUrl?: string;
}

const formatVND = (value: string) => {
  const number = parseFloat(value);
  if (isNaN(number)) return value;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

const AssetSelect = ({ listAsset, onGetAssetSelect, onNext }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const truncateDescription = (text?: string, maxLength: number = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const paginatedData = listAsset?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleGetValueAssetAndNext = (value: string) => {
    onGetAssetSelect(value);
    onNext(value);
  };
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-32 w-32 h-32 bg-purple-200/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-28 h-28 bg-indigo-200/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12 animate-slide-in-up">
            <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <div className="bg-white px-6 py-2 rounded-xl">
                <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
                  💎 CHỌN TÀI SẢN ĐẤU GIÁ
                </span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text">
              Lựa Chọn Tài Sản
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chọn tài sản bạn muốn tham gia đấu giá từ danh sách dưới đây
            </p>

            {/* Quick Stats */}
            <div className="flex justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20">
                <TagOutlined className="text-blue-600" />
                <span className="font-semibold text-gray-700">
                  {listAsset?.length || 0} tài sản
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20">
                <FireOutlined className="text-orange-600" />
                <span className="font-semibold text-gray-700">Đang hot</span>
              </div>
            </div>
          </div>

          {/* Enhanced Asset Cards Grid */}
          {listAsset && listAsset.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {paginatedData?.map((asset, index) => (
                <div
                  key={asset.auctionAssetsId}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:scale-105 hover:shadow-3xl transition-all duration-500 cursor-pointer animate-slide-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {/* Asset Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                    {asset.imageUrl ? (
                      <img
                        src={asset.imageUrl}
                        alt={asset.tagName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PictureOutlined className="text-6xl text-gray-300" />
                      </div>
                    )}

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-glow">
                        <StarOutlined className="text-white text-sm" />
                      </div>
                    </div>

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <Button
                          type="primary"
                          onClick={() => handleGetValueAssetAndNext(asset.auctionAssetsId)}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl font-semibold"
                          icon={<ShoppingCartOutlined />}
                        >
                          Chọn tài sản này
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Asset Content */}
                  <div className="p-6">
                    {/* Asset Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {asset.tagName}
                    </h3>

                    {/* Asset Details */}
                    <div className="space-y-3 mb-6">
                      {/* Unit */}
                      {asset.unit && (
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <ApartmentOutlined className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Đơn vị</p>
                            <p className="text-sm font-bold text-gray-700">{asset.unit}</p>
                          </div>
                        </div>
                      )}

                      {/* Starting Price */}
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <DollarOutlined className="text-white text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Giá khởi điểm</p>
                          <p className="text-sm font-bold text-green-700">
                            {formatVND(asset.startingPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Deposit */}
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <WalletOutlined className="text-white text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Tiền đặt trước</p>
                          <p className="text-sm font-bold text-blue-700">
                            {formatVND(asset.deposit)}
                          </p>
                        </div>
                      </div>

                      {/* Registration Fee */}
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <CreditCardOutlined className="text-white text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Phí đăng ký</p>
                          <p className="text-sm font-bold text-purple-700">
                            {formatVND(asset.registrationFee)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {asset.description && (
                      <div className="mb-4">
                        <Tooltip title={asset.description} placement="top">
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-start gap-2">
                              <FileTextOutlined className="text-gray-400 text-sm mt-1" />
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {truncateDescription(asset.description)}
                              </p>
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      type="primary"
                      block
                      size="large"
                      onClick={() => handleGetValueAssetAndNext(asset.auctionAssetsId)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircleOutlined />
                        Chọn tài sản này
                        <ArrowRightOutlined />
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <PictureOutlined className="text-6xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">Chưa có tài sản</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Hiện tại chưa có tài sản nào có thể đấu giá. Vui lòng quay lại sau.
              </p>
            </div>
          )}

          {/* Enhanced Pagination */}
          {listAsset && listAsset.length > pageSize && (
            <div className="flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={listAsset.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                  className="custom-pagination"
                  showQuickJumper
                  showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} tài sản`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-pagination .ant-pagination-item {
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          margin: 0 4px;
          background: white;
          transition: all 0.3s ease;
        }
        
        .custom-pagination .ant-pagination-item:hover {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .custom-pagination .ant-pagination-item-active {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
        }
        
        .custom-pagination .ant-pagination-item-active a {
          color: white;
        }
        
        .custom-pagination .ant-pagination-prev,
        .custom-pagination .ant-pagination-next {
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: white;
          transition: all 0.3s ease;
        }
        
        .custom-pagination .ant-pagination-prev:hover,
        .custom-pagination .ant-pagination-next:hover {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
};

export default AssetSelect;
