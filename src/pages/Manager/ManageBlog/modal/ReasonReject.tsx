import { Button, Input, message } from "antd";
import CustomModal from "../../../../components/Common/CustomModal";
import { useState } from "react";
import type { ApiResponse } from "../../../../types/responseAxios";
import NewsServices from "../../../../services/NewsService";
interface ReasonRejectProps {
  open: boolean;
  onCancel: () => void;
  blogId: string;
  onStatusChange?: () => void;
}
const ReasonReject = ({
  open,
  onCancel,
  blogId,
  onStatusChange,
}: ReasonRejectProps) => {
  const [reason, setReason] = useState("");
  const handleReject = async () => {
    if (!reason.trim()) {
      message.error("Vui lòng nhập lý do từ chối!");
      return;
    }

    try {
      const response: ApiResponse<unknown> =
        await NewsServices.changeStatusBlog({
          BlogId: blogId,
          Status: 5,
          Note: reason,
        });

      if (response.code === 200) {
        message.success("Từ chối bài viết thành công!");
        onStatusChange?.();
        onCancel();
        setReason("");
      } else {
        message.error(response.message || "Lỗi khi từ chối duyệt bài viết!");
      }
    } catch (error) {
      console.error("Error submitting blog for approval:", error);
      message.error("Lỗi khi từ chối duyệt bài viết!");
    }
  };
  return (
    <CustomModal
      title="Lý do từ chối"
      open={open}
      onCancel={onCancel}
      width={600}
      footer={null}
    >
      <Input.TextArea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Nhập lý do từ chối..."
        rows={4}
        style={{ resize: "none" }}
      />

      <div className="flex justify-end mt-4">
        <Button type="primary" onClick={handleReject} disabled={!reason.trim()}>
          Xác nhận
        </Button>
      </div>
    </CustomModal>
  );
};

export default ReasonReject;
