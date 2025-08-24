import { Modal, Form, Input as AntInput } from "antd";
import type { AuctionDocument } from "../../Modals";

interface DepositConfirmationPopupProps {
    visible: boolean;
    onConfirm: (note: string) => void;
    onCancel: () => void;
    record: AuctionDocument;
    loading?: boolean;
}

const DepositConfirmationPopup: React.FC<DepositConfirmationPopupProps> = ({
    visible,
    onConfirm,
    onCancel,
    record,
    loading = false,
}) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            onConfirm(values.note);
            form.resetFields();
        } catch (error) {
            console.error("Lỗi xác thực:", error);
        }
    };

    return (
        <Modal
            title={`Xác nhận nhận cọc - ${record.name}`}
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Xác nhận"
            cancelText="Hủy"
            confirmLoading={loading}
            okButtonProps={{ className: "bg-teal-500 hover:bg-teal-600" }}
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-red-600">Chú ý</h3>
                <p className="text-gray-600">
                    Vui lòng nhập ghi chú chi tiết về việc xác nhận nhận cọc. Ghi chú này sẽ được lưu lại để tham chiếu sau này.
                </p>
            </div>
            <Form form={form} layout="vertical">
                <Form.Item
                    name="note"
                    label="Ghi chú"
                >
                    <AntInput.TextArea rows={4} placeholder="Nhập ghi chú..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DepositConfirmationPopup;