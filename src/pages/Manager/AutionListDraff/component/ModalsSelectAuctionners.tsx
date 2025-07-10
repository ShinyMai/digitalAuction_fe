import { Modal, Select, Button } from "antd";
import type { ModalAuctioners } from "../../../Staff/Modals";

interface Props {
    isOpen: boolean;
    listAuctioners: ModalAuctioners[];
    onClose: () => void;
    onSelect: (value: string) => void;
}

const ModalsSelectAuctioners = ({ isOpen, listAuctioners, onClose, onSelect }: Props) => {
    return (
        <Modal
            open={isOpen}
            title={
                <div className="text-xl font-semibold text-gray-800">
                    Chọn Đấu Giá Viên
                </div>
            }
            onCancel={onClose}
            footer={
                <div className="flex justify-end gap-2">
                    <Button
                        type="primary"
                        onClick={() => {
                            const selectedValue = (document.querySelector(".ant-select-selection-item") as HTMLElement)?.title;
                            if (selectedValue) {
                                const selectedAuctioner = listAuctioners.find(
                                    (auctioner) => auctioner.name === selectedValue
                                );
                                if (selectedAuctioner) {
                                    onSelect(selectedAuctioner.id);
                                }
                            }
                        }}
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={!listAuctioners.length}
                    >
                        Xác nhận
                    </Button>
                </div>
            }
            className="w-full max-w-md rounded-lg"
            centered
        >
            <div className="p-4 flex flex-col gap-3">
                <p className="text-sm text-gray-600">
                    Vui lòng chọn một đấu giá viên từ danh sách dưới đây để gán cho phiên đấu giá.
                </p>
                <Select
                    className="w-full"
                    placeholder="Chọn một đấu giá viên"
                    onChange={onSelect}
                    options={listAuctioners.map((auctioner) => ({
                        value: auctioner.id,
                        label: auctioner.name,
                    }))}
                    size="large"
                    showSearch
                    optionFilterProp="label"
                    notFoundContent="Không tìm thấy đấu giá viên"
                />
            </div>
        </Modal>
    );
};

export default ModalsSelectAuctioners;