// src/components/SepayAuctionregister.tsx
import { Image, Row, Col, message, Card, Button, Spin } from "antd";
import {
  QrcodeOutlined,
  BankOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  CreditCardOutlined,
  IdcardOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TagOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import type {
  AuctionAsset,
  dataPayment,
  RegistrationAuctionModals,
  UserInfomation,
} from "../../../Anonymous/Modals";
import ExportDocx from "../../../../components/Common/ExportDocs";
import AuctionServices from "../../../../services/AuctionServices";
import { useEffect, useState } from "react";
import { formatNumber } from "../../../../utils/numberFormat";

interface Props {
  dataQrSepay?: dataPayment;
  dataUser?: UserInfomation;
  dataAutionAsset?: AuctionAsset;
}

const SepayAuctionregister: React.FC<Props> = ({ dataQrSepay, dataUser, dataAutionAsset }) => {
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(45);

  const getDataExport = () => {
    const valueReturn: RegistrationAuctionModals = {
      address: dataUser?.originLocation,
      fullName: dataUser?.name,
      phone: dataUser?.phoneNumber,
      dob: dataUser?.birthDay,
      idNumber: dataUser?.citizenIdentification,
      idDate: dataUser?.issueDate,
      place: dataUser?.issueBy,
      assetsInfo: dataAutionAsset?.tagName,
      priceStart: dataAutionAsset?.startingPrice,
      auctionInfo: dataAutionAsset?.description,
      bankAccount: dataQrSepay?.beneficiaryBank,
      bankAccountNumber: dataQrSepay?.accountNumber,
      bankBranch: dataQrSepay?.accountNumber,
    };
    return valueReturn;
  };

  const getaAuctionDocumentById = async (id: string) => {
    try {
      const res = await AuctionServices.getAuctionById(id);
      console.log(res?.data?.status);
      if (res?.data?.statusTicket === 1) {
        setIsPaid(true);
        setIsChecking(false);
        return true;
      } else {
        setIsPaid(false);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    if (dataQrSepay?.auctionDocumentsId) {
      let callCount = 0;
      const maxCalls = 15;

      const intervalId = setInterval(async () => {
        callCount++;
        setCountdown(45 - callCount * 3);

        const isPaidResult = await getaAuctionDocumentById(dataQrSepay.auctionDocumentsId);

        if (isPaidResult || callCount >= maxCalls) {
          clearInterval(intervalId);
          setIsChecking(false);

          if (!isPaidResult && callCount >= maxCalls) {
            setIsPaid(false);
            message.error("Thanh toán thất bại! Vui lòng thử lại hoặc liên hệ hỗ trợ.");
          }
        }
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [dataQrSepay]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
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
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12 animate-slide-in-up">
            <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <div className="bg-white px-6 py-2 rounded-xl">
                <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
                  💳 THANH TOÁN ĐĂNG KÝ
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text mb-4">
              Hoàn Tất Đăng Ký
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Vui lòng thực hiện thanh toán để hoàn tất quá trình đăng ký tham gia đấu giá
            </p>
          </div>

          {/* Payment Status Card */}
          <div className="mb-8 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            <Card className="text-center bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
              <div
                className={`p-6 ${
                  isPaid
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : isChecking
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "bg-gradient-to-r from-orange-500 to-red-600"
                } text-white relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                <div className="relative z-10">
                  {isPaid ? (
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <CheckCircleOutlined className="text-3xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Thanh toán thành công!</h3>
                        <p className="opacity-90">Đăng ký đã được xác nhận</p>
                      </div>
                    </div>
                  ) : isChecking ? (
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <Spin
                          indicator={
                            <ClockCircleOutlined className="text-3xl text-white animate-spin" />
                          }
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Đang kiểm tra thanh toán...</h3>
                        <p className="opacity-90">Thời gian còn lại: {countdown}s</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <QrcodeOutlined className="text-3xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Chờ thanh toán</h3>
                        <p className="opacity-90">Quét mã QR để thanh toán</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Section */}
            <div className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <Card className="h-full bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <QrcodeOutlined className="text-white text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Mã QR Thanh Toán</h2>
                  </div>

                  <div className="text-center">
                    <div className="relative inline-block p-4 bg-white rounded-2xl shadow-lg mb-6">
                      <Image
                        src={dataQrSepay?.qrUrl || ""}
                        preview={false}
                        width={250}
                        height={250}
                        className="rounded-xl"
                      />
                      {!isPaid && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">Sử dụng ứng dụng ngân hàng để quét mã QR</p>

                    {isPaid && (
                      <Button
                        type="primary"
                        size="large"
                        icon={<DownloadOutlined />}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
                        onClick={() => setIsPaid(true)}
                      >
                        Tải xuống giấy đăng ký
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Payment Information */}
            <div className="animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
              <Card className="h-full bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <BankOutlined className="text-white text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Thông Tin Thanh Toán</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <CreditCardOutlined className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Số Tài Khoản</p>
                        <p className="font-bold text-gray-800 text-lg">
                          {dataQrSepay?.accountNumber || "Chưa có"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <BankOutlined className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Ngân Hàng</p>
                        <p className="font-bold text-gray-800 text-lg">
                          {dataQrSepay?.beneficiaryBank || "Chưa có"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <DollarOutlined className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Phí Đăng Ký</p>
                        <p className="font-bold text-gray-800 text-lg">
                          {formatNumber(dataQrSepay?.amountTicket)} VND
                        </p>
                      </div>
                    </div>

                    {dataQrSepay?.description && (
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600 font-medium mb-2">Mô Tả</p>
                        <p className="text-gray-800 leading-relaxed">{dataQrSepay.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* User Information */}
          <div className="mt-8 animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <UserOutlined className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Thông Tin Người Đăng Ký</h2>
                </div>

                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={12} lg={8}>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <UserOutlined className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Họ Tên</p>
                        <p className="font-bold text-gray-800">{dataUser?.name || "Chưa có"}</p>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CalendarOutlined className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Ngày Sinh</p>
                        <p className="font-bold text-gray-800">{dataUser?.birthDay || "Chưa có"}</p>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <IdcardOutlined className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Số CCCD</p>
                        <p className="font-bold text-gray-800">
                          {dataUser?.citizenIdentification || "Chưa có"}
                        </p>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <CalendarOutlined className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Ngày Cấp</p>
                        <p className="font-bold text-gray-800">
                          {dataUser?.issueDate || "Chưa có"}
                        </p>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <EnvironmentOutlined className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Nơi Cấp</p>
                        <p className="font-bold text-gray-800">{dataUser?.issueBy || "Chưa có"}</p>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <PhoneOutlined className="text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Số Điện Thoại</p>
                        <p className="font-bold text-gray-800">
                          {dataUser?.phoneNumber || "Chưa có"}
                        </p>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24}>
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                      <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center mt-1">
                        <EnvironmentOutlined className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Hộ khẩu thường trú</p>
                        <p className="font-bold text-gray-800 leading-relaxed">
                          {dataUser?.originLocation || "Chưa có"}
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </div>

          {/* Asset Information */}
          <div className="mt-8 animate-slide-in-up" style={{ animationDelay: "0.5s" }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <SafetyOutlined className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Thông Tin Tài Sản Đấu Giá</h2>
                </div>

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <TagOutlined className="text-indigo-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Tên Tài Sản</p>
                        <p className="font-bold text-gray-800 text-lg">
                          {dataAutionAsset?.tagName || "Chưa có"}
                        </p>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <DollarOutlined className="text-green-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Giá Khởi Điểm</p>
                        <p className="font-bold text-gray-800 text-lg">
                          {formatNumber(dataAutionAsset?.startingPrice)}{" "}
                          {dataAutionAsset?.unit || "VND"}
                        </p>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <SafetyOutlined className="text-orange-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Tiền Đặt Cọc</p>
                        <p className="font-bold text-gray-800 text-lg">
                          {formatNumber(dataAutionAsset?.deposit)} {dataAutionAsset?.unit || "VND"}
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {isPaid && (
        <ExportDocx open={isPaid} onCancel={() => setIsPaid(false)} data={getDataExport()} />
      )}

      <style>{`
        @keyframes animate-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }

        @keyframes animate-slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: animate-float 6s ease-in-out infinite;
        }

        .animate-slide-in-up {
          animation: animate-slide-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default SepayAuctionregister;
