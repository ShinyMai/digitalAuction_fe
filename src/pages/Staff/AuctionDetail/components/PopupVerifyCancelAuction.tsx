import React from "react";
import { Modal, Button, Form, Input, Typography } from "antd";
import { UploadOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import CustomUploadFile from "../../PostAuction/components/Upload";
import AuctionServices from "../../../../services/AuctionServices";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

interface WarningModalProps {
  isOpen: boolean;
  auctionId?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

interface CancelFormValue {
  CancelReasonFile?: {
    originFileObj: File;
    name: string;
  }[];
  CancelReason?: string;
}

const PopupVerifyCancelAuction: React.FC<WarningModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  auctionId,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: CancelFormValue) => {
    try {
      const cancelAuctionFile = values.CancelReasonFile?.[0]?.originFileObj;
      const formedValue = {
        CancelAuctionFile: cancelAuctionFile,
        CancelReason: values.CancelReason,
      };

      // Tạo FormData
      const formData = new FormData();
      if (formedValue.CancelAuctionFile) {
        formData.append("CancelReasonFile", formedValue.CancelAuctionFile);
      }
      if (formedValue.CancelReason) {
        formData.append("CancelReason", formedValue.CancelReason);
      }
      if (auctionId) {
        formData.append("AuctionId", auctionId);
      }
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await AuctionServices.cancelAuction(formData);
      if (response.code === 200) {
        toast.success(response.message);
        onConfirm(); // Gọi onConfirm để xử lý logic hủy
      } else {
        toast.warning(response.message || "Hủy đấu giá không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi submit form:", error);
    }
  };
  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onCancel}
      centered
      closable={false}
      width={600}
      className="modern-cancel-modal"
      styles={{
        content: {
          padding: 0,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <div className="relative bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 right-4 w-32 h-32 bg-red-100/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-orange-100/30 rounded-full blur-xl"></div>
        </div>
        <div className="relative z-10 p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <ExclamationCircleOutlined className="text-white text-3xl" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl opacity-20 blur animate-pulse"></div>
            </div>

            <Title level={3} className="!mb-2 !text-slate-800 font-bold">
              Xác nhận hủy đấu giá
            </Title>

            <Text className="text-slate-600 text-base leading-relaxed block max-w-md mx-auto">
              Việc hủy phiên đấu giá cần có lý do chính đáng và tài liệu chứng minh. Vui lòng cung
              cấp đầy đủ thông tin bên dưới.
            </Text>
          </div>

          {/* Form Section */}
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              {" "}
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <UploadOutlined className="text-white text-sm" />
                </div>
                <Text className="font-semibold text-slate-700 text-lg">Tài liệu chứng minh</Text>
              </div>
              <Form.Item
                name="CancelReasonFile"
                rules={[{ required: true, message: "Vui lòng tải lên file lý do hủy!" }]}
                className="mb-0"
              >
                <CustomUploadFile contentName="CancelReasonFile" />
              </Form.Item>
              <Text className="text-slate-500 text-sm mt-2 block">
                Tải lên văn bản chính thức nêu rõ lý do hủy phiên đấu giá
              </Text>
            </div>

            {/* Reason Input Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <CloseCircleOutlined className="text-white text-sm" />
                </div>
                <Text className="font-semibold text-slate-700 text-lg">Lý do hủy</Text>
              </div>

              <Form.Item
                name="CancelReason"
                rules={[{ required: true, message: "Vui lòng nhập lý do hủy!" }]}
                className="mb-0"
              >
                <Input.TextArea
                  placeholder="Nhập lý do chi tiết về việc hủy phiên đấu giá..."
                  rows={4}
                  className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-500 resize-none"
                />
              </Form.Item>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={onCancel}
                size="large"
                type="primary"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-0 rounded-xl px-8 py-3 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-0 rounded-xl px-8 py-3 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ExclamationCircleOutlined className="mr-2" />
                Xác nhận hủy
              </Button>
            </div>
          </Form>
        </div>{" "}
      </div>

      {/* Custom CSS styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                    .modern-cancel-modal .ant-modal-content {
                        border-radius: 20px !important;
                        overflow: hidden !important;
                    }
                    
                    .modern-cancel-modal .ant-form-item-label > label {
                        font-weight: 600 !important;
                        color: #374151 !important;
                    }
                    
                    .modern-cancel-modal .ant-input:focus,
                    .modern-cancel-modal .ant-input-focused {
                        border-color: #3b82f6 !important;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
                    }
                    
                    .modern-cancel-modal .ant-btn:hover {
                        transform: translateY(-1px) !important;
                    }
                `,
        }}
      />
    </Modal>
  );
};

export default PopupVerifyCancelAuction;
