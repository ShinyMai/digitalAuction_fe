import { Modal, Button } from "antd";
import React from "react";

interface ChooseUserTypeProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: "old" | "new") => void;
}

const ChooseUserType: React.FC<ChooseUserTypeProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={
        <div className="text-xl font-bold text-blue-700 text-center">
          Chọn loại khách hàng
        </div>
      }
      className="!rounded-2xl"
    >
      <div className="flex flex-col gap-6 items-center py-4">
        <Button
          type="primary"
          className="w-48 h-14 rounded-xl text-lg font-semibold bg-blue-500 hover:bg-blue-600"
          onClick={() => onSelect("old")}
        >
          Khách hàng cũ
        </Button>
        <Button
          type="default"
          className="w-48 h-14 rounded-xl text-lg font-semibold border-blue-500 text-blue-600 hover:bg-blue-50"
          onClick={() => onSelect("new")}
        >
          Khách hàng mới
        </Button>
      </div>
    </Modal>
  );
};

export default ChooseUserType;
