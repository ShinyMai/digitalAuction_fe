import { useLocation } from "react-router-dom";
import AuctionServices from "../../../services/AuctionServices";
import { useEffect, useState } from "react";
import type { AuctionDataDetail } from "../Modals";
import { Button, Image } from "antd";
import dayjs from "dayjs";
import MINPHAPLOGO from "../../../assets/LOGO-MINH-PHAP.jpg";

const AuctionDetail = () => {
  const location = useLocation();
  const [dataAuctionDetail, setDataAuctionDetail] =
    useState<AuctionDataDetail | null>(null);

  useEffect(() => {
    getAuctionDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuctionDetail = async () => {
    try {
      const auctionId = location.state?.key;
      if (!auctionId) {
        console.error(
          "Không có ID đấu giá trong location.state"
        );
        return;
      }
      const response =
        await AuctionServices.getAuctionDetail(auctionId);
      setDataAuctionDetail(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đấu giá:", error);
    }
  };

  return (
    <section className="w-full h-screen overflow-y-auto no-scrollbar p-4 md:p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {dataAuctionDetail ? (
          <>
            {/* Header: Logo và tiêu đề */}
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
                <h2 className="text-xl font-semibold text-red-600 mt-2 text-center">
                  VẬN THÁNH AN
                </h2>
              </div>
              <div className="w-full md:w-2/3 pl-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  XEM CHI TIẾT THÔNG BÁO ĐẤU GIÁ TÀI SẢN
                </h1>
                <p className="text-gray-600 mb-4">
                  {dataAuctionDetail.auctionName ||
                    "Ngân hàng TMCP Quốc tế Việt Nam"}
                </p>
                {/* Thông tin chi tiết, mỗi trường 1 dòng */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Ngày mở đăng ký:
                    </span>
                    <span>
                      {dataAuctionDetail.registerOpenDate
                        ? dayjs(
                            dataAuctionDetail.registerOpenDate
                          ).format("DD/MM/YYYY")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Hạn đăng ký:
                    </span>
                    <span>
                      {dataAuctionDetail.registerEndDate
                        ? dayjs(
                            dataAuctionDetail.registerEndDate
                          ).format("DD/MM/YYYY")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Thời điểm bắt đầu phiên đấu giá:
                    </span>
                    <span>
                      {dataAuctionDetail.auctionStartDate
                        ? dayjs(
                            dataAuctionDetail.auctionStartDate
                          ).format("DD/MM/YYYY")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Thời điểm kết thúc phiên đấu giá:
                    </span>
                    <span>
                      {dataAuctionDetail.auctionEndDate
                        ? dayjs(
                            dataAuctionDetail.auctionEndDate
                          ).format("DD/MM/YYYY")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Số tiền khởi điểm:
                    </span>
                    <span>
                      {dataAuctionDetail.numberRoundMax
                        ? `${dataAuctionDetail.numberRoundMax.toLocaleString()} VND`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Giá trúng:
                    </span>
                    <span>
                      {dataAuctionDetail.winnerData || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Tiền đặt trước:
                    </span>
                    <span>
                      {dataAuctionDetail.qrLink
                        ? "500,000 VND"
                        : "-"}
                    </span>{" "}
                    {/* Giả định */}
                  </div>
                </div>
              </div>
            </div>

            {/* Nút Đấu giá */}
            <div className="text-center mt-6">
              <Button
                type="primary"
                size="large"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded"
              >
                Đấu giá
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        )}
      </div>
    </section>
  );
};

export default AuctionDetail;
