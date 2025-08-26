import { Modal, Button, Typography, Form, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface CreateRoundFormData {
    priceMin: number;
    priceMax: number;
    totalPriceMax: number;
}

interface CreateRoundModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: CreateRoundFormData & { auctionId: string }) => void;
    auctionId: string;
    loading?: boolean;
}

const CreateRoundModal = ({ visible, onCancel, onSubmit, auctionId, loading = false }: CreateRoundModalProps) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit({
                ...values,
                auctionId
            });
            form.resetFields();
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <div className="!flex !items-center !gap-2 text-black">
                    <PlusOutlined className="!text-green-500" />
                    <span>Tạo vòng đấu giá mới</span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} disabled={loading}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    className="!bg-green-500 !border-green-500 hover:!bg-green-600"
                >
                    Tạo vòng đấu giá
                </Button>,
            ]}
            width={600}
        >
            <div className="!py-4">
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        label={<Text strong>Bước giá tối thiểu (VND)</Text>}
                        name="priceMin"
                        rules={[
                            { type: "number", min: 1000, message: "Bước giá tối thiểu phải ít nhất 1,000 VND" },
                            {
                                validator: (_, value) => {
                                    if (value && value % 1000 !== 0) {
                                        return Promise.reject('Giá không được lẻ đến hàng trăm đồng');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập bước giá tối thiểu"
                            className="!w-full"
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            addonAfter="VND"
                            step={1000}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<Text strong>Bước giá tối đa (VND)</Text>}
                        name="priceMax"
                        rules={[
                            { type: "number", min: 1000, message: "Không được nhập lẻ đến hàng trăm đồng" },
                            {
                                validator: (_, value) => {
                                    if (value && value % 1000 !== 0) {
                                        return Promise.reject('Không được nhập lẻ đến hàng trăm đồng');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập giá tối đa"
                            className="!w-full"
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            addonAfter="VND"
                            step={1000}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<Text strong>Giá tối đa (VND)</Text>}
                        name="totalPriceMax"
                        rules={[
                            { type: "number", min: 1000, message: "Không được nhập lẻ đến hàng trăm đồng" },
                            {
                                validator: (_, value) => {
                                    if (value && value % 1000 !== 0) {
                                        return Promise.reject('Không được nhập lẻ đến hàng trăm đồng');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập bước giá tối đa"
                            className="!w-full"
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            addonAfter="VND"
                            step={1000}
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default CreateRoundModal;
