// src/components/SepayAuctionregister.tsx
import { Image, Row, Col, Typography, message } from "antd";
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

const SepayAuctionregister: React.FC<Props> = ({
  dataQrSepay,
  dataUser,
  dataAutionAsset,
}) => {
  const [isPaid, setIsPaid] = useState<boolean>(false);
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

        const isPaidResult = await getaAuctionDocumentById(
          dataQrSepay.auctionDocumentsId
        );

        if (isPaidResult || callCount >= maxCalls) {
          clearInterval(intervalId);

          if (!isPaidResult && callCount >= maxCalls) {
            setIsPaid(false);
            message.error(
              "Thanh toán thất bại! Vui lòng thử lại hoặc liên hệ hỗ trợ."
            );
          }
        }
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [dataQrSepay]);

  return (
    <section className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <Typography.Title
          level={2}
          className="text-center text-blue-600 mb-6"
        >
          Thông Tin Đăng Ký Đấu Giá
        </Typography.Title>

        <div className="mb-6 text-center">
          <Typography.Title
            level={4}
            className="text-gray-800 mb-2"
          >
            Mã QR Thanh Toán
          </Typography.Title>
          <Image
            src={dataQrSepay?.qrUrl || ""}
            preview={false}
            width={200}
            height={200}
            className="mx-auto"
          />
          {isPaid && (
            <ExportDocx
              open={isPaid}
              onCancel={() => setIsPaid(false)}
              data={getDataExport()}
            />
          )}
        </div>

        {/* Payment Information */}
        <div className="mb-6">
          <Typography.Title
            level={4}
            className="text-gray-800 mb-4"
          >
            Thông Tin Thanh Toán
          </Typography.Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                Số Tài Khoản:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataQrSepay?.accountNumber || "Chưa có"}
              </Typography.Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                Ngân Hàng Lợi Ích:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataQrSepay?.beneficiaryBank || "Chưa có"}
              </Typography.Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                Phí Đăng Ký:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {formatNumber(dataQrSepay?.amountTicket)}{" "}
                VND
              </Typography.Text>
            </Col>
            <Col xs={24}>
              <Typography.Text strong>
                Mô Tả:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataQrSepay?.description || "Chưa có"}
              </Typography.Text>
            </Col>
          </Row>
        </div>

        {/* User Information */}
        <div className="mb-6">
          <Typography.Title
            level={4}
            className="text-gray-800 mb-4"
          >
            Thông Tin Người Dùng
          </Typography.Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                Họ Tên:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataUser?.name || "Chưa có"}
              </Typography.Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                Ngày Sinh:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataUser?.birthDay || "Chưa có"}
              </Typography.Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                Số CCCD:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataUser?.citizenIdentification ||
                  "Chưa có"}
              </Typography.Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                Ngày Cấp:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataUser?.issueDate || "Chưa có"}
              </Typography.Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                Nơi Cấp:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataUser?.issueBy || "Chưa có"}
              </Typography.Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text strong>
                Số Điện Thoại:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataUser?.phoneNumber || "Chưa có"}
              </Typography.Text>
            </Col>
            <Col xs={24}>
              <Typography.Text strong>
                Hộ khẩu thường chú:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataUser?.originLocation || "Chưa có"}
              </Typography.Text>
            </Col>
          </Row>
        </div>

        {/* Auction Asset Information */}
        <div className="mb-8">
          <Typography.Title
            level={4}
            className="text-gray-800 mb-4"
          >
            Thông Tin Tài Sản Đấu Giá
          </Typography.Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12}>
              <Typography.Text strong>
                Tên Nhãn:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {dataAutionAsset?.tagName || "Chưa có"}
              </Typography.Text>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <Typography.Text strong>
                Giá Khởi Điểm:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {formatNumber(
                  dataAutionAsset?.startingPrice
                )}{" "}
                {dataAutionAsset?.unit || ""}
              </Typography.Text>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Typography.Text strong>
                Đặt Cọc:
              </Typography.Text>
              <Typography.Text className="block mt-1">
                {formatNumber(dataAutionAsset?.deposit)}{" "}
                {dataAutionAsset?.unit || ""}
              </Typography.Text>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

export default SepayAuctionregister;
