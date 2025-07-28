import { useState } from "react";
import { Select, Button } from "antd";
import type { ModalAuctioners } from "../../../Staff/Modals";
import CustomModal from "../../../../components/Common/CustomModal";

interface Props {
  isOpen: boolean;
  listAuctioners: ModalAuctioners[];
  onClose: () => void;
  onSelect: (value: string) => void;
}

const ModalsSelectAuctioners = ({ isOpen, listAuctioners, onClose, onSelect }: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  return (
    <CustomModal
      open={isOpen}
      onCancel={onClose}
      centered
      closable={true}
      title="Chọn Đấu Giá Viên"
      footer={
        <div className="flex justify-end gap-2 pb-4">
          <Button onClick={onClose}>Huỷ</Button>
          <Button
            type="primary"
            className="bg-blue-500 hover:bg-blue-600 transition duration-150"
            disabled={!selectedId}
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>
        </div>
      }
      width={600}
    >
      <div className="flex flex-col gap-4 p-4">
        <p className="text-sm text-gray-600">
          Vui lòng chọn một đấu giá viên từ danh sách dưới đây để gán cho phiên đấu giá.
        </p>
        <Select
          className="w-full"
          placeholder="Chọn một đấu giá viên"
          size="large"
          showSearch
          optionFilterProp="label"
          notFoundContent="Không tìm thấy đấu giá viên"
          options={listAuctioners.map((auctioner) => ({
            value: auctioner.id,
            label: auctioner.name,
          }))}
          onChange={(value) => setSelectedId(value)}
          value={selectedId ?? undefined}
        />
      </div>
    </CustomModal>
  );
};

export default ModalsSelectAuctioners;
