import React from "react";
import { Typography } from "antd";
import type { RegistrationAuctionModals } from "../../../pages/Anonymous/Modals";
import CustomModal from "../CustomModal";
import { CheckCircleFilled } from "@ant-design/icons";
import { exportToDocx } from "./DocumentGenerator";

interface Props {
  data?: Partial<RegistrationAuctionModals>;
  open?: boolean;
  onCancel?: () => void;
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  onBackStep?: () => void;
}

const ExportDocxRegistration: React.FC<Props> = ({
  data,
  open,
  onCancel,
  closable = true,
  maskClosable = true,
  keyboard = true,
  onBackStep,
}) => {
  const handleExportClick = () => {
    exportToDocx(data);
    // Chờ 3 giây trước khi thực hiện onBackStep
    setTimeout(() => {
      if (onBackStep) onBackStep();
    }, 3000);
  };

  return (
    <CustomModal
      title={null}
      open={open}
      onCancel={closable ? onCancel : undefined}
      width={600}
      footer={null}
      bodyStyle={{ padding: 0 }}
      closable={closable}
      maskClosable={maskClosable}
      keyboard={keyboard}
    >
      <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center shadow-lg text-green-500">
            <CheckCircleFilled className="text-5xl" />
          </div>
        </div>

        <Typography.Title level={4} className="!text-green-600 mb-4">
          🎉 Thanh toán thành công!
        </Typography.Title>

        <Typography.Paragraph className="text-gray-700 text-base mb-6">
          Bạn đã hoàn tất thanh toán phí đăng ký tham gia đấu giá tài sản.
        </Typography.Paragraph>

        <Typography.Paragraph className="text-gray-700 text-base mb-6">
          Nhấn nút bên dưới để{" "}
          <span className="font-semibold text-blue-600">
            tải về phiếu đăng ký
          </span>{" "}
          tham gia đấu giá tài sản của bạn.
        </Typography.Paragraph>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-700">
            ⚠️ <span className="font-semibold">Lưu ý quan trọng:</span> Vui lòng
            tải xuống phiếu đăng ký và nộp lại cho chúng tôi để hoàn tất quá
            trình đăng ký. Thông báo này sẽ chỉ hiển thị một lần!
          </p>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 !text-amber-50 font-semibold mt-8 py-2 px-6 rounded-xl transition-colors duration-300 mb-4 w-full md:w-auto"
          onClick={handleExportClick}
        >
          📥 Tải phiếu đăng ký
        </button>

        <Typography.Paragraph className="">
          <span className="text-red-500 font-bold text-[15px] mt-4">
            ⚠️ Lưu ý: Kiểm tra lại thông tin và gửi phiếu trước ngày hết hạn
            đăng ký.
          </span>
        </Typography.Paragraph>
      </div>
    </CustomModal>
  );
};

export default ExportDocxRegistration;
