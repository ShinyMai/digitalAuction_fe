import { Modal, Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface CreateRoundModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit?: () => void;
}

const CreateRoundModal = ({ visible, onCancel, onSubmit }: CreateRoundModalProps) => {
    return (
        <Modal
            title={
                <div className="!flex !items-center !gap-2">
                    <PlusOutlined className="!text-green-500" />
                    <span>Tạo vòng đấu giá mới</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={onSubmit}
                    className="!bg-green-500 !border-green-500 hover:!bg-green-600"
                >
                    Tạo vòng đấu giá
                </Button>,
            ]}
            width={600}
        >
            <div className="!py-4">
                <Text className="!text-gray-600">
                    Tính năng tạo vòng đấu giá mới sẽ được phát triển trong phiên bản tiếp theo.
                </Text>
            </div>
        </Modal>
    );
};

export default CreateRoundModal;
