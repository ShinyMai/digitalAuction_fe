import { Modal, Input, Button, Typography, Form } from "antd";
import { CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface RejectReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    loading?: boolean;
}

const RejectReasonModal = ({ isOpen, onClose, onConfirm, loading = false }: RejectReasonModalProps) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onConfirm(values.reason);
            form.resetFields();
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            centered
            width={520}
            destroyOnClose
            className="!p-0"
            styles={{
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.15)' },
                content: { padding: 0, overflow: 'hidden' }
            }}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="p-0"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-100 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="w-10 h-10 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center"
                                >
                                    <ExclamationCircleOutlined className="text-rose-600 text-lg" />
                                </motion.div>
                                <div>
                                    <Title level={4} className="!text-slate-800 !mb-1 !font-semibold">
                                        Xác nhận từ chối phiên đấu giá
                                    </Title>
                                    <Text className="!text-slate-600 !text-sm">
                                        Vui lòng nhập lý do không phê duyệt phiên đấu giá này
                                    </Text>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6 bg-white">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                className="space-y-4"
                            >
                                <Form.Item
                                    name="reason"
                                    label={
                                        <span className="!text-slate-700 !font-medium">
                                            Lý do không phê duyệt <span className="text-rose-500">*</span>
                                        </span>
                                    }
                                    rules={[
                                        { required: true, message: "Vui lòng nhập lý do không phê duyệt" },
                                        { min: 10, message: "Lý do phải có ít nhất 10 ký tự" },
                                        { max: 500, message: "Lý do không được vượt quá 500 ký tự" }
                                    ]}
                                    className="!mb-0"
                                >
                                    <TextArea
                                        placeholder="Nhập lý do cụ thể tại sao phiên đấu giá này không được phê duyệt..."
                                        rows={4}
                                        maxLength={500}
                                        showCount
                                        className="!border-slate-200 !rounded-lg hover:!border-rose-300 focus:!border-rose-400 focus:!shadow-sm !transition-all !duration-200"
                                        style={{
                                            resize: 'none'
                                        }}
                                    />
                                </Form.Item>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4">


                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            icon={<CloseCircleOutlined />}
                                            className="!bg-gradient-to-r !from-rose-500 !to-pink-500 hover:!from-rose-600 hover:!to-pink-600 !border-none !rounded-lg !px-6 !py-2 !h-auto !font-medium !shadow-sm hover:!shadow-md !transition-all !duration-200"
                                        >
                                            {loading ? "Đang xử lý..." : "Xác nhận từ chối"}
                                        </Button>
                                    </motion.div>
                                </div>
                            </Form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default RejectReasonModal;
