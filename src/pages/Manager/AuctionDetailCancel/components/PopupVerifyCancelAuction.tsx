import React from "react";
import { Modal, Button, Form, Input } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import AuctionServices from "../../../../services/AuctionServices";
import { toast } from "react-toastify";
import CustomUploadFile from "../../../Staff/PostAuction/components/Upload";

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
      const response = await AuctionServices.cancelAuction(formData);
      toast.success(response.message);
      onConfirm(); // Gọi onConfirm để xử lý logic hủy
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
      width={400}
      className="rounded-lg"
    >
      <div className="flex flex-col items-center justify-center p-6">
        <div className="text-yellow-500 text-6xl">
          <WarningOutlined className="mb-4" />
        </div>

        <p className="text-center text-gray-700 text-lg font-medium mb-6">
          Hủy buổi đấu giá cần phải tải lên file nêu rõ nguyên nhân hủy
        </p>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="CancelReasonFile"
            rules={[
              { required: true, message: "Vui lòng tải lên file lý do hủy!" },
            ]}
          >
            <CustomUploadFile contentName="CancelReasonFile" />
          </Form.Item>
          <Form.Item
            name="CancelReason"
            rules={[{ required: true, message: "Vui lòng nhập lý do hủy!" }]}
          >
            <Input.TextArea placeholder="Nhập lý do hủy..." />
          </Form.Item>
          <div className="flex justify-center gap-4 w-full">
            <Button
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md px-4 py-2"
            >
              Quay lại
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-red-500 hover:bg-red-600 border-none rounded-md px-4 py-2"
            >
              Vẫn hủy
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default PopupVerifyCancelAuction;
