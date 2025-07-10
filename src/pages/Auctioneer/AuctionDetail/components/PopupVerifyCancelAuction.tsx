import React from "react";
import { Modal, Button } from "antd";
import { WarningOutlined } from "@ant-design/icons";

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
            width={400}
            className="rounded-lg"
        >
            <div className="flex flex-col items-center justify-center p-6">
                <div className="text-yellow-500 text-6xl ">
                    <WarningOutlined className=" mb-4" />
                </div>

                <p className="text-center text-gray-700 text-lg font-medium mb-6">
                    Hủy buổi đấu giá cần phải tải lên file nêu rõ nguyên nhân hủy
                </p>
                <div className="flex justify-center gap-4 w-full">
                    <Button
                        onClick={onCancel}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md px-4 py-2"
                    >
                        Quay lại
                    </Button>
                    <Button
                        type="primary"
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 border-none rounded-md px-4 py-2"
                    >
                        Vẫn hủy
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PopupVerifyCancelAuction;