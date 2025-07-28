/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Upload, Button, Card, message, Row, Col } from "antd";
import { SaveOutlined, UploadOutlined, FileTextOutlined, EyeOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import type { AuctionCategory, AuctionDataDetail } from "../../Modals";
import AuctionServices from "../../../../services/AuctionServices";
import { toast } from "react-toastify";

interface UpdateAuctionProps {
    auctionDetailData: AuctionDataDetail | undefined;
    auctionType?: string;
    auctionId?: string;
}

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const UpdateAuction = ({ auctionDetailData, auctionType, auctionId }: UpdateAuctionProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [listAuctionCategory, setListAuctionCategory] = useState<{ label: string, value: number }[]>();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    useEffect(() => {
        getListAuctionCategory();
    }, []);

    const getListAuctionCategory = async () => {
        try {
            const res = await AuctionServices.getListAuctionCategory();
            if (res.data.length === 0) {
                toast.error("Không có dữ liệu lớp tài sản!");
            } else {
                // Map data ngay khi call API
                const mappedCategories = res.data.map((category: AuctionCategory) => ({
                    label: category.categoryName,
                    value: category.categoryId,
                }));
                setListAuctionCategory(mappedCategories);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (auctionDetailData && listAuctionCategory) {
            // Tìm categoryId dựa trên categoryName
            const selectedCategory = listAuctionCategory.find(
                category => category.label === auctionDetailData.categoryName
            );

            const categoryId = selectedCategory ? selectedCategory.value : null;
            setSelectedCategoryId(categoryId);

            form.setFieldsValue({
                AuctionName: auctionDetailData.auctionName,
                AuctionDescription: auctionDetailData.auctionDescription,
                RegisterDateRange: auctionDetailData.registerOpenDate && auctionDetailData.registerEndDate
                    ? [dayjs(auctionDetailData.registerOpenDate), dayjs(auctionDetailData.registerEndDate)]
                    : null,
                AuctionDateRange: auctionDetailData.auctionStartDate && auctionDetailData.auctionEndDate
                    ? [dayjs(auctionDetailData.auctionStartDate), dayjs(auctionDetailData.auctionEndDate)]
                    : null,
                CategoryId: categoryId,
                NumberRoundMax: auctionDetailData.numberRoundMax,
            });
        }
    }, [auctionDetailData, listAuctionCategory, form]);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            console.log("Form values:", values);
            // Add your API call here
            message.success("Cập nhật đấu giá thành công!");
        } catch (error: any) {
            message.error("Có lỗi xảy ra khi cập nhật!", error);
        } finally {
            setLoading(false);
        }
    };

    // Validation functions for date ranges
    const disabledRegisterDate = (current: any, { from }: any) => {
        if (!from) return false;
        // End date cannot be before start date
        return current && current < from;
    };

    const disabledAuctionDate = (current: any, { from }: any) => {
        const registerDates = form.getFieldValue('RegisterDateRange');

        if (!from) {
            // For start date: must be at least 7 days after register start date
            if (registerDates && registerDates[0]) {
                const registerStartDate = dayjs(registerDates[0]);
                return current && current < registerStartDate.add(7, 'day');
            }
            return false;
        } else {
            // For end date: cannot be before start date
            return current && current < from;
        }
    };

    const validateAuctionDateRange = () => {
        const registerDates = form.getFieldValue('RegisterDateRange');
        const auctionDates = form.getFieldValue('AuctionDateRange');

        if (!registerDates || !auctionDates) return Promise.resolve();

        const registerEnd = dayjs(registerDates[1]);
        const auctionStart = dayjs(auctionDates[0]);

        // Auction start must be 1-3 days after register end
        const minDays = registerEnd.add(1, 'day');
        const maxDays = registerEnd.add(3, 'day');

        if (auctionStart < minDays || auctionStart > maxDays) {
            return Promise.reject(new Error('Thời gian bắt đầu đấu giá phải sau ngày kết thúc đăng ký từ 1 đến 3 ngày!'));
        }

        return Promise.resolve();
    };

    const uploadProps = {
        beforeUpload: () => false, // Prevent auto upload
        maxCount: 1,
    };

    const handleViewFile = (fileType: string, fileName?: string) => {
        if (!fileName) {
            message.info(`Chưa có file ${fileType} được tải lên`);
            return;
        }
        // Open file in new tab or show modal
        // You can implement actual file viewing logic here
        message.info(`Đang mở file ${fileType}: ${fileName}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="!p-6"
        >
            <Card
                title={
                    <div className="flex items-center !text-blue-800 !text-xl !font-bold">
                        <FileTextOutlined className="!mr-3 !text-blue-600" />
                        Cập nhật thông tin đấu giá
                    </div>
                }
                className="!shadow-lg !border-0 !bg-gradient-to-r !from-blue-50 !to-teal-50"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="!space-y-4"
                >
                    <Row gutter={[24, 16]}>
                        {/* Basic Information */}
                        <Col span={24}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h3 className="!text-lg !font-semibold !text-blue-800 !mb-4 !border-b !border-blue-200 !pb-2">
                                    Thông tin cơ bản
                                </h3>
                            </motion.div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Form.Item
                                    name="AuctionName"
                                    label={<span className="!font-medium !text-blue-900">Tên đấu giá</span>}
                                    rules={[{ required: true, message: "Vui lòng nhập tên đấu giá!" }]}
                                >
                                    <Input
                                        placeholder="Nhập tên đấu giá"
                                        className="!rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                                        size="large"
                                    />
                                </Form.Item>
                            </motion.div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Form.Item
                                    name="CategoryId"
                                    label={<span className="!font-medium !text-blue-900">Danh mục</span>}
                                    rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                                >
                                    <Select
                                        placeholder="Chọn danh mục"
                                        options={listAuctionCategory}
                                        className="!rounded-lg"
                                        size="large"
                                        onChange={(value) => setSelectedCategoryId(value)}
                                    />
                                </Form.Item>
                            </motion.div>
                        </Col>

                        <Col span={24}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Form.Item
                                    name="AuctionDescription"
                                    label={<span className="!font-medium !text-blue-900">Mô tả đấu giá</span>}
                                >
                                    <TextArea
                                        placeholder="Nhập mô tả chi tiết về đấu giá"
                                        rows={4}
                                        className="!rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                                    />
                                </Form.Item>
                            </motion.div>
                        </Col>

                        {/* Date Settings */}
                        <Col span={24}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h3 className="!text-lg !font-semibold !text-blue-800 !mb-4 !border-b !border-blue-200 !pb-2">
                                    Thiết lập thời gian
                                </h3>
                            </motion.div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Form.Item
                                    name="RegisterDateRange"
                                    label={<span className="!font-medium !text-blue-900">Thời gian đăng ký (Từ - Đến)</span>}
                                    rules={[{ required: true, message: "Vui lòng chọn thời gian đăng ký!" }]}
                                >
                                    <RangePicker
                                        placeholder={["Ngày mở đăng ký", "Hạn đăng ký"]}
                                        className="!w-full !rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                                        size="large"
                                        format="DD/MM/YYYY HH:mm"
                                        showTime={{
                                            format: 'HH',
                                        }}
                                        disabledDate={disabledRegisterDate}
                                        onChange={() => {
                                            // Clear auction dates when register dates change
                                            form.setFieldsValue({ AuctionDateRange: null });
                                        }}
                                    />
                                </Form.Item>
                            </motion.div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <Form.Item
                                    name="AuctionDateRange"
                                    label={<span className="!font-medium !text-blue-900">Thời gian đấu giá (Từ - Đến)</span>}
                                    rules={[
                                        { required: true, message: "Vui lòng chọn thời gian đấu giá!" },
                                        { validator: validateAuctionDateRange }
                                    ]}
                                >
                                    <RangePicker
                                        placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                                        className="!w-full !rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                                        size="large"
                                        format="DD/MM/YYYY HH:mm"
                                        showTime={{
                                            format: 'HH'
                                        }}
                                        disabledDate={disabledAuctionDate}
                                    />
                                </Form.Item>
                            </motion.div>
                        </Col>

                        {/* Settings */}
                        <Col span={24}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.0 }}
                            >
                                <h3 className="!text-lg !font-semibold !text-blue-800 !mb-4 !border-b !border-blue-200 !pb-2">
                                    Cài đặt đấu giá
                                </h3>
                            </motion.div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                            >
                                <Form.Item
                                    name="NumberRoundMax"
                                    label={<span className="!font-medium !text-blue-900">Số vòng tối đa</span>}
                                    rules={[
                                        {
                                            type: 'number',
                                            min: 1,
                                            max: 5,
                                            message: "Số vòng tối đa phải từ 1 đến 5 vòng!"
                                        }
                                    ]}
                                >
                                    <Input
                                        type="number"
                                        placeholder="Nhập số vòng tối đa (1-5)"
                                        className="!rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                                        size="large"
                                        min={1}
                                        max={5}
                                    />
                                </Form.Item>
                            </motion.div>
                        </Col>

                        {/* File Uploads */}
                        <Col span={24}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.4 }}
                            >
                                <h3 className="!text-lg !font-semibold !text-blue-800 !mb-4 !border-b !border-blue-200 !pb-2">
                                    Tải lên tài liệu
                                </h3>
                            </motion.div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 }}
                            >
                                <Form.Item
                                    name="AuctionAssetFile"
                                    label={
                                        <div className="flex items-center justify-between">
                                            <span className="!font-medium !text-blue-900">File tài sản đấu giá</span>
                                            <Button
                                                type="link"
                                                size="small"
                                                icon={<EyeOutlined />}
                                                onClick={() => handleViewFile('tài sản đấu giá', 'current-asset-file.pdf')}
                                                className="!text-blue-600 hover:!text-blue-800"
                                            >
                                                Xem hiện tại
                                            </Button>
                                        </div>
                                    }
                                >
                                    <Upload {...uploadProps} className="!w-full">
                                        <Button
                                            icon={<UploadOutlined />}
                                            className="!w-full !h-12 !rounded-lg !border-blue-200 hover:!border-blue-400 !flex !items-center !justify-center"
                                            size="large"
                                        >
                                            Tải lên file tài sản
                                        </Button>
                                    </Upload>
                                </Form.Item>
                            </motion.div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.6 }}
                            >
                                <Form.Item
                                    name="AuctionRulesFile"
                                    label={
                                        <div className="flex items-center justify-between">
                                            <span className="!font-medium !text-blue-900">File quy tắc đấu giá</span>
                                            <Button
                                                type="link"
                                                size="small"
                                                icon={<EyeOutlined />}
                                                onClick={() => handleViewFile('quy tắc đấu giá', 'current-rules.pdf')}
                                                className="!text-blue-600 hover:!text-blue-800"
                                            >
                                                Xem hiện tại
                                            </Button>
                                        </div>
                                    }
                                >
                                    <Upload {...uploadProps} className="!w-full">
                                        <Button
                                            icon={<UploadOutlined />}
                                            className="!w-full !h-12 !rounded-lg !border-blue-200 hover:!border-blue-400 !flex !items-center !justify-center"
                                            size="large"
                                        >
                                            Tải lên file quy tắc
                                        </Button>
                                    </Upload>
                                </Form.Item>
                            </motion.div>
                        </Col>

                        {/* Conditional rendering for maps - only show when CategoryId = 2 */}
                        {selectedCategoryId === 2 && (
                            <>
                                <Col xs={24} lg={12}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.7 }}
                                    >
                                        <Form.Item
                                            name="AuctionPlanningMap"
                                            label={
                                                <div className="flex items-center justify-between">
                                                    <span className="!font-medium !text-blue-900">Bản đồ quy hoạch</span>
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => handleViewFile('bản đồ quy hoạch', 'current-planning-map.pdf')}
                                                        className="!text-blue-600 hover:!text-blue-800"
                                                    >
                                                        Xem hiện tại
                                                    </Button>
                                                </div>
                                            }
                                        >
                                            <Upload {...uploadProps} className="!w-full">
                                                <Button
                                                    icon={<UploadOutlined />}
                                                    className="!w-full !h-12 !rounded-lg !border-blue-200 hover:!border-blue-400 !flex !items-center !justify-center"
                                                    size="large"
                                                >
                                                    Tải lên bản đồ quy hoạch
                                                </Button>
                                            </Upload>
                                        </Form.Item>
                                    </motion.div>
                                </Col>

                                <Col xs={24} lg={12}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.8 }}
                                    >
                                        <Form.Item
                                            name="Auction_Map"
                                            label={
                                                <div className="flex items-center justify-between">
                                                    <span className="!font-medium !text-blue-900">Bản đồ tài sản</span>
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => handleViewFile('bản đồ tài sản', 'current-asset-map.pdf')}
                                                        className="!text-blue-600 hover:!text-blue-800"
                                                    >
                                                        Xem hiện tại
                                                    </Button>
                                                </div>
                                            }
                                        >
                                            <Upload {...uploadProps} className="!w-full">
                                                <Button
                                                    icon={<UploadOutlined />}
                                                    className="!w-full !h-12 !rounded-lg !border-blue-200 hover:!border-blue-400 !flex !items-center !justify-center"
                                                    size="large"
                                                >
                                                    Tải lên bản đồ tài sản
                                                </Button>
                                            </Upload>
                                        </Form.Item>
                                    </motion.div>
                                </Col>
                            </>
                        )}

                        {/* Submit Button */}
                        <Col span={24}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.9 }}
                                className="!flex !justify-center !mt-8"
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                    size="large"
                                    className="!bg-gradient-to-r !from-blue-500 !to-teal-500 !border-0 hover:!from-blue-600 hover:!to-teal-600 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !px-12 !h-12 !rounded-lg !font-semibold"
                                >
                                    Cập nhật đấu giá
                                </Button>
                            </motion.div>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </motion.div>
    );
};

export default UpdateAuction;
