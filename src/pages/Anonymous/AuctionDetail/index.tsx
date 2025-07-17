/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from "react-router-dom";
import AuctionServices from "../../../services/AuctionServices";
import { useEffect, useState } from "react";
import type { AuctionDataDetail } from "../Modals";
import { Button, Image, Tabs, Typography, Card } from "antd";
import MINPHAPLOGO from "../../../assets/LOGO-MINH-PHAP.jpg";
import dayjs from "dayjs";
import { USER_ROUTERS } from "../../../routers";
import { useSelector } from "react-redux";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const AuctionDetailAnonymous = () => {
  const location = useLocation();
  const [auctionDetailData, setAuctionDetailData] = useState<AuctionDataDetail>();
  const navigate = useNavigate();
  const { user } = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.auth
  );

  useEffect(() => {
    console.log(location.state.key);
    getAuctionDetailById(location.state.key);
  }, []);

  const getAuctionDetailById = async (auctionId: string) => {
    try {
      const response = await AuctionServices.getAuctionDetail(auctionId);
      setAuctionDetailData(response.data);
    } catch (error) {
      console.log(error);
    }
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
        <div
          className="absolute bottom-20 right-20 w-36 h-36 bg-cyan-200/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {auctionDetailData ? (
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20">
              {/* Enhanced Header Section */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden group">
                          <Image
                            src={MINPHAPLOGO}
                            alt="Logo Minh Pháp"
                            className="w-28 h-28 lg:w-36 lg:h-36 object-contain group-hover:scale-110 transition-transform duration-300"
                            preview={false}
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse-glow"></div>
                      </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                      <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                        <span className="text-sm font-semibold flex items-center gap-2">
                          <TrophyOutlined className="text-yellow-300" />
                          PHIÊN ĐẤU GIÁ CHÍNH THỨC
                        </span>
                      </div>
                      <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight">
                        Chi Tiết Thông Báo
                        <span className="block text-yellow-300">Đấu Giá Tài Sản</span>
                      </h1>
                      <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                        {auctionDetailData.auctionName || "Thông tin đấu giá tài sản"}
                      </p>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
                              <CalendarOutlined className="text-xl text-blue-200" />
                            </div>
                            <div>
                              <p className="text-sm text-blue-200">Ngày đấu giá</p>
                              <p className="font-bold text-white">
                                {auctionDetailData.auctionStartDate
                                  ? dayjs(auctionDetailData.auctionStartDate).format("DD/MM/YYYY")
                                  : "Chưa xác định"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center">
                              <ClockCircleOutlined className="text-xl text-green-200" />
                            </div>
                            <div>
                              <p className="text-sm text-green-200">Hạn đăng ký</p>
                              <p className="font-bold text-white">
                                {auctionDetailData.registerEndDate
                                  ? dayjs(auctionDetailData.registerEndDate).format("DD/MM/YYYY")
                                  : "Chưa xác định"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center">
                              <TeamOutlined className="text-xl text-purple-200" />
                            </div>
                            <div>
                              <p className="text-sm text-purple-200">Số vòng</p>
                              <p className="font-bold text-white">
                                {auctionDetailData.numberRoundMax || "Không giới hạn"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Tabs */}
              <Tabs
                defaultActiveKey="1"
                className="w-full enhanced-tabs"
                tabBarStyle={{
                  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  padding: "20px",
                  borderRadius: "0",
                  margin: "0",
                  borderBottom: "1px solid #e2e8f0",
                }}
                items={[
                  {
                    key: "1",
                    label: (
                      <span className="flex items-center gap-2 font-semibold">
                        <FileTextOutlined />
                        Thông tin đấu giá
                      </span>
                    ),
                    children: (
                      <div className="p-8">
                        {/* Enhanced Info Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <CalendarOutlined className="text-white text-sm" />
                              </div>
                              Thời gian quan trọng
                            </h3>

                            <div className="space-y-4">
                              {[
                                {
                                  icon: <CalendarOutlined className="text-green-600" />,
                                  label: "Ngày mở đăng ký",
                                  value: auctionDetailData.registerOpenDate
                                    ? dayjs(auctionDetailData.registerOpenDate).format("DD/MM/YYYY")
                                    : "-",
                                  color: "green",
                                },
                                {
                                  icon: <ClockCircleOutlined className="text-red-600" />,
                                  label: "Hạn đăng ký",
                                  value: auctionDetailData.registerEndDate
                                    ? dayjs(auctionDetailData.registerEndDate).format("DD/MM/YYYY")
                                    : "-",
                                  color: "red",
                                },
                                {
                                  icon: <TrophyOutlined className="text-blue-600" />,
                                  label: "Bắt đầu đấu giá",
                                  value: auctionDetailData.auctionStartDate
                                    ? dayjs(auctionDetailData.auctionStartDate).format("DD/MM/YYYY")
                                    : "-",
                                  color: "blue",
                                },
                                {
                                  icon: <FileTextOutlined className="text-purple-600" />,
                                  label: "Kết thúc đấu giá",
                                  value: auctionDetailData.auctionEndDate
                                    ? dayjs(auctionDetailData.auctionEndDate).format("DD/MM/YYYY")
                                    : "-",
                                  color: "purple",
                                },
                              ].map((item, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-4 bg-gradient-to-r from-${item.color}-50 to-${item.color}-100 rounded-xl border border-${item.color}-200 hover:shadow-md transition-all duration-300`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-10 h-10 bg-${item.color}-500/10 rounded-lg flex items-center justify-center`}
                                    >
                                      {item.icon}
                                    </div>
                                    <span className="font-semibold text-gray-800">
                                      {item.label}:
                                    </span>
                                  </div>
                                  <span
                                    className={`font-bold text-${item.color}-700 px-3 py-1 bg-white/50 rounded-lg`}
                                  >
                                    {item.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                                <DollarOutlined className="text-white text-sm" />
                              </div>
                              Thông tin tài chính
                            </h3>

                            <div className="space-y-4">
                              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                    <DollarOutlined className="text-yellow-600" />
                                  </div>
                                  <span className="font-semibold text-gray-800">
                                    Số vòng quy định:
                                  </span>
                                </div>
                                <span className="font-bold text-yellow-700 text-lg bg-white/50 px-3 py-1 rounded-lg">
                                  {auctionDetailData.numberRoundMax || "Không giới hạn"}
                                </span>
                              </div>

                              {auctionDetailData.winnerData && (
                                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                      <TrophyOutlined className="text-green-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800">Giá trúng:</span>
                                  </div>
                                  <span className="font-bold text-green-700 text-lg bg-white/50 px-3 py-1 rounded-lg">
                                    {auctionDetailData.winnerData}
                                  </span>
                                </div>
                              )}

                              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <DollarOutlined className="text-blue-600" />
                                  </div>
                                  <span className="font-semibold text-gray-800">
                                    Tiền đặt trước:
                                  </span>
                                </div>
                                <span className="font-bold text-blue-700 text-lg bg-white/50 px-3 py-1 rounded-lg">
                                  {auctionDetailData.qrLink ? "500,000 VND" : "Chưa xác định"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Registration Button */}
                        <div className="text-center">
                          <div className="inline-block p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                            <h4 className="text-xl font-bold text-gray-800 mb-4">
                              Sẵn sàng tham gia đấu giá?
                            </h4>
                            <Button
                              type="primary"
                              size="large"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 px-8 py-6 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              disabled={!user}
                              onClick={() =>
                                navigate(USER_ROUTERS.SUB.AUCTION_REGISTER, {
                                  replace: true,
                                  state: { key: auctionDetailData },
                                })
                              }
                            >
                              <span className="flex items-center gap-3">
                                <TeamOutlined className="text-xl" />
                                {user ? "Đăng ký tham gia" : "Vui lòng đăng nhập"}
                                <ArrowRightOutlined className="text-lg" />
                              </span>
                            </Button>
                            {!user && (
                              <p className="text-gray-600 mt-4 text-sm">
                                Quý khách cần đăng ký tài khoản để có thể tham gia đấu giá
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <span className="flex items-center gap-2 font-semibold">
                        <DollarOutlined />
                        Mô tả tài sản
                      </span>
                    ),
                    children: (
                      <div className="p-8">
                        <div className="mb-8">
                          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FileTextOutlined className="text-white text-sm" />
                            </div>
                            Mô tả chung
                          </h3>
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                            <div
                              className="text-gray-700 leading-relaxed prose prose-blue max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: auctionDetailData.auctionDescription || "Không có mô tả.",
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                              <DollarOutlined className="text-white text-sm" />
                            </div>
                            Danh sách tài sản đấu giá
                          </h3>
                          {auctionDetailData.listAuctionAssets &&
                          auctionDetailData.listAuctionAssets.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {auctionDetailData.listAuctionAssets.map((asset, index) => (
                                <Card
                                  key={asset.auctionAssetsId}
                                  className="shadow-lg hover:shadow-xl transition-all duration-500 bg-white border-0 rounded-2xl overflow-hidden group hover:scale-105"
                                  style={{
                                    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                                    animationDelay: `${0.1 * index}s`,
                                  }}
                                >
                                  <div className="p-6">
                                    {/* Asset Header */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                          <DollarOutlined className="text-white text-lg" />
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                            {asset.tagName || "Tài sản không tên"}
                                          </h4>
                                          {asset.unit && (
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                              {asset.unit}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Asset Details */}
                                    <div className="space-y-4">
                                      {[
                                        {
                                          label: "Giá khởi điểm",
                                          value: asset.startingPrice
                                            ? `${parseFloat(asset.startingPrice).toLocaleString(
                                                "vi-VN"
                                              )} VND`
                                            : "-",
                                          color: "blue",
                                          icon: <DollarOutlined />,
                                        },
                                        {
                                          label: "Tiền đặt trước",
                                          value: asset.deposit
                                            ? `${parseFloat(asset.deposit).toLocaleString(
                                                "vi-VN"
                                              )} VND`
                                            : "-",
                                          color: "green",
                                          icon: <DollarOutlined />,
                                        },
                                        {
                                          label: "Phí đăng ký",
                                          value: asset.registrationFee
                                            ? `${parseFloat(asset.registrationFee).toLocaleString(
                                                "vi-VN"
                                              )} VND`
                                            : "-",
                                          color: "purple",
                                          icon: <DollarOutlined />,
                                        },
                                      ].map((item, idx) => (
                                        <div
                                          key={idx}
                                          className={`flex items-center justify-between p-3 bg-gradient-to-r from-${item.color}-50 to-${item.color}-100 rounded-xl`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <div
                                              className={`w-8 h-8 bg-${item.color}-500/20 rounded-lg flex items-center justify-center`}
                                            >
                                              <span className={`text-${item.color}-600 text-sm`}>
                                                {item.icon}
                                              </span>
                                            </div>
                                            <span className="font-semibold text-gray-700">
                                              {item.label}:
                                            </span>
                                          </div>
                                          <span
                                            className={`font-bold text-${item.color}-700 bg-white/70 px-2 py-1 rounded-lg text-sm`}
                                          >
                                            {item.value}
                                          </span>
                                        </div>
                                      ))}

                                      {asset.description && (
                                        <div className="p-3 bg-gradient-to-r from-gray-50 to-slate-100 rounded-xl">
                                          <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center mt-1">
                                              <FileTextOutlined className="text-gray-600 text-sm" />
                                            </div>
                                            <div className="flex-1">
                                              <span className="font-semibold text-gray-700 block mb-1">
                                                Mô tả:
                                              </span>
                                              <span className="text-gray-600 text-sm leading-relaxed">
                                                {asset.description}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {asset.createdAt && (
                                        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                                          <span className="flex items-center gap-2">
                                            <CalendarOutlined />
                                            Ngày tạo:
                                          </span>
                                          <span className="font-semibold">
                                            {dayjs(asset.createdAt).format("DD/MM/YYYY")}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                <DollarOutlined className="text-4xl text-gray-400" />
                              </div>
                              <h4 className="text-xl font-semibold text-gray-600 mb-2">
                                Chưa có tài sản
                              </h4>
                              <p className="text-gray-500">
                                Không có tài sản đấu giá nào được liệt kê.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "3",
                    label: (
                      <span className="flex items-center gap-2 font-semibold">
                        <FileTextOutlined />
                        Điều khoản tuân thủ
                      </span>
                    ),
                    children: (
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <FileTextOutlined className="text-white text-sm" />
                          </div>
                          Điều khoản tuân thủ
                        </h3>
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200">
                          {auctionDetailData.auctionRules ? (
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                                <FileTextOutlined className="text-white text-2xl" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                Tài liệu điều khoản
                              </h4>
                              <Typography.Link
                                href={auctionDetailData.auctionRules}
                                target="_blank"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                              >
                                <FileTextOutlined />
                                Xem chi tiết điều khoản
                                <ArrowRightOutlined />
                              </Typography.Link>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                                <FileTextOutlined className="text-gray-500 text-2xl" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-600 mb-2">
                                Chưa có điều khoản
                              </h4>
                              <p className="text-gray-500">
                                Không có điều khoản tuân thủ được cung cấp.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full flex items-center justify-center animate-pulse">
                  <FileTextOutlined className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Đang tải thông tin</h3>
                <p className="text-gray-500">Vui lòng chờ trong giây lát...</p>
                <div className="flex justify-center mt-4">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .enhanced-tabs .ant-tabs-tab {
          border-radius: 12px !important;
          padding: 12px 24px !important;
          margin-right: 8px !important;
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          transition: all 0.3s ease !important;
        }
        
        .enhanced-tabs .ant-tabs-tab:hover {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        
        .enhanced-tabs .ant-tabs-tab-active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
          color: white !important;
          border-color: transparent !important;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3) !important;
        }
        
        .enhanced-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white !important;
        }
        
        .enhanced-tabs .ant-tabs-ink-bar {
          display: none !important;
        }
        
        .enhanced-tabs .ant-tabs-content-holder {
          background: white !important;
          border-radius: 0 0 24px 24px !important;
        }
      `}</style>
    </section>
  );
};

export default AuctionDetailAnonymous;
