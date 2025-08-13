import { Image, Typography, Card, Alert, Button } from "antd";
import MINPHAPLOGO from "../../../../assets/LOGO-MINH-PHAP.jpg";
import dayjs from "dayjs";
import type { AuctionDataDetail } from "../../Modals";
import { useState } from "react";
import PopupVerifyCancelAuction from "./PopupVerifyCancelAuction";
import {
  EnvironmentOutlined,
  WarningOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

interface AuctionDetailProps {
  auctionDetailData: AuctionDataDetail | undefined;
  auctionType?: string;
  auctionId?: string;
}

const API_BASE_URL_NODE = import.meta.env.VITE_BE_URL_NODE;

const AuctionDetail = ({
  auctionDetailData,
  auctionType,
  auctionId,
}: AuctionDetailProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-teal-50 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-6">
        {auctionDetailData ? (
          <div className="space-y-8">
            {/* Thông báo hủy đấu giá - Hiển thị nổi bật ở đầu trang */}
            {(auctionDetailData.cancelReason ||
              auctionDetailData.cancelReasonFile) && (
              <div className="mb-8">
                <Alert
                  message={
                    <div className="flex items-center">
                      <WarningOutlined className="text-orange-600 mr-2 text-xl" />
                      <span className="font-bold text-orange-800 text-lg">
                        Phiên đấu giá này đã bị hủy
                      </span>
                    </div>
                  }
                  description={
                    <div className="mt-4">
                      {/* Lý do hủy */}
                      {auctionDetailData.cancelReason && (
                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400 mb-4">
                          <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                            <FileTextOutlined className="mr-2" />
                            Lý do hủy đấu giá:
                          </h4>
                          <div className="bg-white p-3 rounded-md border border-orange-200">
                            <p className="text-orange-700 whitespace-pre-wrap leading-relaxed text-sm">
                              {auctionDetailData.cancelReason}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* File lý do hủy */}
                      {auctionDetailData.cancelReasonFile && (
                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                          <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                            <FileTextOutlined className="mr-2" />
                            Tài liệu lý do hủy:
                          </h4>
                          <div className="bg-white p-3 rounded-md border border-orange-200">
                            <Button
                              type="link"
                              icon={<DownloadOutlined />}
                              href={
                                auctionType === "SQL"
                                  ? auctionDetailData.cancelReasonFile
                                  : API_BASE_URL_NODE +
                                    "/" +
                                    auctionDetailData.cancelReasonFile
                              }
                              target="_blank"
                              className="text-orange-600 hover:text-orange-800 font-medium p-0"
                            >
                              Tải xuống tài liệu lý do hủy đấu giá
                            </Button>
                            <div className="mt-2">
                              <span className="text-xs text-orange-500">
                                Click để xem chi tiết tài liệu giải trình
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  }
                  type="warning"
                  showIcon={false}
                  className="border-orange-300 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}

            {/* Thông tin đấu giá */}
            <div className="flex flex-col md:flex-row items-stretch mb-6">
              <div className="w-full md:w-1/3 mb-4 md:mb-0 flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={MINPHAPLOGO}
                    alt="Logo Minh Pháp"
                    className="w-full max-w-[200px] md:max-w-[250px] object-contain"
                    preview={false}
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3 pl-0 md:pl-4">
                <h1 className="text-xl md:text-2xl font-bold text-blue-800 mb-2">
                  XEM CHI TIẾT THÔNG BÁO ĐẤU GIÁ TÀI SẢN
                </h1>
                <p className="text-teal-700 mb-4">
                  {auctionDetailData.auctionName ||
                    "Ngân hàng TMCP Quốc tế Việt Nam"}
                </p>
                <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Ngày mở đăng ký:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.registerOpenDate
                        ? dayjs(auctionDetailData.registerOpenDate).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Hạn đăng ký:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.registerEndDate
                        ? dayjs(auctionDetailData.registerEndDate).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Thời điểm bắt đầu phiên đấu giá:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.auctionStartDate
                        ? dayjs(auctionDetailData.auctionStartDate).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Thời điểm kết thúc phiên đấu giá:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.auctionEndDate
                        ? dayjs(auctionDetailData.auctionEndDate).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Số vòng quy định:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.numberRoundMax || "-"}
                    </span>
                  </div>
                  {auctionDetailData.winnerData && (
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-900">
                        Giá trúng:
                      </span>
                      <span className="text-teal-800">
                        {auctionDetailData.winnerData}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Tiền đặt trước:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.qrLink ? "500,000 VND" : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mô tả tài sản và danh sách tài sản */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Mô tả chung
              </h3>
              <p className="text-teal-700 mb-6 bg-blue-50 p-4 rounded-lg">
                {auctionDetailData.auctionDescription || "Không có mô tả."}
              </p>

              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Danh sách tài sản đấu giá
              </h3>
              {auctionDetailData.listAuctionAssets &&
              auctionDetailData.listAuctionAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {auctionDetailData.listAuctionAssets.map((asset) => (
                    <Card
                      key={asset.auctionAssetsId}
                      className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-blue-50 border border-teal-100"
                      title={
                        <div className="flex items-center justify-between">
                          <span className="text-base font-semibold text-blue-800">
                            {asset.tagName || "Tài sản không tên"}
                          </span>
                          <span className="text-sm text-teal-600">
                            {asset.unit ? `(${asset.unit})` : ""}
                          </span>
                        </div>
                      }
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-900">
                            Giá khởi điểm:
                          </span>
                          <span className="text-teal-800">
                            {asset.startingPrice
                              ? `${parseFloat(
                                  asset.startingPrice
                                ).toLocaleString("vi-VN")} VND`
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-900">
                            Tiền đặt trước:
                          </span>
                          <span className="text-teal-800">
                            {asset.deposit
                              ? `${parseFloat(asset.deposit).toLocaleString(
                                  "vi-VN"
                                )} VND`
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-900">
                            Phí đăng ký:
                          </span>
                          <span className="text-teal-800">
                            {asset.registrationFee
                              ? `${parseFloat(
                                  asset.registrationFee
                                ).toLocaleString("vi-VN")} VND`
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-900">
                            Mô tả:
                          </span>
                          <span className="text-teal-700 text-right">
                            {asset.description || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-900">
                            Ngày tạo:
                          </span>
                          <span className="text-teal-800">
                            {asset.createdAt
                              ? dayjs(asset.createdAt).format("DD/MM/YYYY")
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-teal-600 py-6 bg-blue-50 rounded-lg">
                  Không có tài sản đấu giá nào được liệt kê.
                </div>
              )}
            </div>

            {/* Điều khoản tuân thủ */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Điều khoản tuân thủ
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                {auctionDetailData.auctionRules ? (
                  <Typography.Link
                    href={
                      auctionType === "SQL"
                        ? auctionDetailData.auctionRules
                        : API_BASE_URL_NODE +
                          "/" +
                          auctionDetailData.auctionRules
                    }
                    target="_blank"
                    className="text-teal-600"
                  >
                    Click để xem chi tiết
                  </Typography.Link>
                ) : (
                  <p className="text-teal-700">Không có điều khoản tuân thủ.</p>
                )}
              </div>
            </div>

            {/* Thông tin bản đồ */}
            {auctionDetailData.auctionMap ||
            auctionDetailData.auctionPlanningMap ? (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Thông tin bản đồ tài sản
                </h3>
                <div className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div>
                    {auctionDetailData.auctionPlanningMap && (
                      <div className="flex items-center bg-blue-50 pt-4 pl-4 rounded-lg">
                        <EnvironmentOutlined className="text-teal-600 mr-2" />
                        <Typography.Link
                          href={
                            auctionType === "SQL"
                              ? auctionDetailData.auctionPlanningMap
                              : API_BASE_URL_NODE +
                                "/" +
                                auctionDetailData.auctionPlanningMap
                          }
                          target="_blank"
                          className="text-teal-600 font-medium hover:text-teal-800 "
                        >
                          Xem bản đồ tài sản
                        </Typography.Link>
                      </div>
                    )}
                    {auctionDetailData.auctionMap && (
                      <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                        <EnvironmentOutlined className="text-teal-600 mr-2" />
                        <Typography.Link
                          href={
                            auctionType === "SQL"
                              ? auctionDetailData.auctionMap
                              : API_BASE_URL_NODE +
                                "/" +
                                auctionDetailData.auctionMap
                          }
                          target="_blank"
                          className="text-teal-600 font-medium hover:text-teal-800"
                        >
                          Xem trên Google Maps
                        </Typography.Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="text-center text-teal-600 py-6 bg-blue-50 rounded-lg">
            Đang tải dữ liệu...
          </div>
        )}
        <PopupVerifyCancelAuction
          isOpen={isModalOpen}
          auctionId={auctionId}
          onCancel={handleModalCancel}
          onConfirm={handleModalConfirm}
        />
      </div>
    </section>
  );
};

export default AuctionDetail;
