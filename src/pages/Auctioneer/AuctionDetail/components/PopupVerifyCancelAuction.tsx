import React from "react";
import { Modal, Button, Typography } from "antd";
import { WarningOutlined, ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface WarningModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const PopupVerifyCancelAuction: React.FC<WarningModalProps> = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onCancel}
      centered
      closable={false}
      width={480}
      className="cancel-auction-modal"
      bodyStyle={{ padding: 0 }}
    >
      <div className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <ExclamationCircleOutlined className="text-3xl" />
          </div>
          <Title level={3} className="!text-white !mb-2">
            Xác nhận hủy phiên đấu giá
          </Title>
          <Text className="text-red-100">Hành động này không thể hoàn tác</Text>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
              <WarningOutlined className="text-4xl text-yellow-600" />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-200">
              <Title level={4} className="!text-gray-800 !mb-3">
                Lưu ý quan trọng
              </Title>
              <Text className="text-gray-600 text-base leading-relaxed">
                Hủy buổi đấu giá cần phải tải lên file nêu rõ nguyên nhân hủy. Tất cả người tham gia
                sẽ được hoàn tiền và thông báo về việc hủy.
              </Text>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={onCancel}
              size="large"
              className="min-w-[120px] h-12 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg font-medium transition-all duration-300"
              icon={<CloseOutlined />}
            >
              Quay lại
            </Button>
            <Button
              type="primary"
              danger
              onClick={onConfirm}
              size="large"
              className="min-w-[120px] h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              icon={<ExclamationCircleOutlined />}
            >
              Xác nhận hủy
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/10 rounded-full"></div>
      </div>

      <style>{`
                .cancel-auction-modal .ant-modal-content {
                    border-radius: 16px !important;
                    overflow: hidden;
                    padding: 0 !important;
                }
                
                .cancel-auction-modal .ant-modal-body {
                    padding: 0 !important;
                }
            `}</style>
    </Modal>
  );
};

export default PopupVerifyCancelAuction;
