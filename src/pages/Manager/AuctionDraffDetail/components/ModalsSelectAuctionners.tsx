import { useState } from "react";
import { Select, Button, Alert } from "antd";
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
      onClose(); // Đóng modal sau khi xác nhận
    }
  };

  return (
    <CustomModal
      open={isOpen}
      onCancel={onClose}
      centered
      closable={true}
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-800">
            Xác nhận thông tin phiên đấu giá
          </span>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-lg">
          <Button
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-150"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition duration-200"
            disabled={!selectedId}
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>
        </div>
      }
      width={600}
      className="rounded-lg shadow-xl"
    >
      <div className="flex flex-col gap-6 px-6 bg-white">
        <div>Vui lòng chọn một đấu giá viên từ danh sách bên dưới để gán cho phiên đấu giá.</div>
        <Select
          className="w-full rounded-md"
          placeholder="Chọn một đấu giá viên"
          size="large"
          showSearch
          optionFilterProp="label"
          notFoundContent={
            <div className="text-center text-gray-500 py-4">Không tìm thấy đấu giá viên</div>
          }
          options={listAuctioners.map((auctioner) => ({
            value: auctioner.id,
            label: (
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-medium">{auctioner.name}</span>
              </div>
            ),
          }))}
          onChange={(value) => setSelectedId(value)}
          value={selectedId ?? undefined}
          popupClassName="rounded-md shadow-md"
        />
        <Alert
          message="Lưu ý"
          description="Vui lòng kiểm tra kỹ thông tin trước khi xác nhận để đảm bảo phiên đấu giá được gán chính xác!"
          type="warning"
          showIcon
          className="bg-yellow-50 border-yellow-200 text-yellow-800 rounded-md"
        />
      </div>
    </CustomModal>
  );
};

export default ModalsSelectAuctioners;
