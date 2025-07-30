/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Upload, Button, Card, message, Row, Col, Typography } from "antd";
import { SaveOutlined, UploadOutlined, FileTextOutlined, EyeOutlined, ArrowRightOutlined } from "@ant-design/icons";
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

const UpdateAuction = ({ auctionDetailData, auctionId }: UpdateAuctionProps) => {
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

            // Tạo submitValue với format date phù hợp - chỉ thêm khi có giá trị
            const submitValue: any = {};

            // Thêm AuctionId từ props (trường bắt buộc)
            if (auctionId) {
                submitValue.AuctionId = auctionId;
            }

            // Thêm các field cơ bản nếu có giá trị (tất cả đều bắt buộc)
            if (values.AuctionName) submitValue.AuctionName = values.AuctionName;
            if (values.AuctionDescription) submitValue.AuctionDescription = values.AuctionDescription;
            if (values.CategoryId) submitValue.CategoryId = values.CategoryId;
            if (values.NumberRoundMax) submitValue.NumberRoundMax = values.NumberRoundMax;

            // Format RegisterDateRange thành RegisterOpenDate và RegisterEndDate - chỉ khi có giá trị (bắt buộc)
            if (values.RegisterDateRange?.[0]) {
                submitValue.RegisterOpenDate = dayjs(values.RegisterDateRange[0]).format('YYYY-MM-DD HH:mm:ss');
            }
            if (values.RegisterDateRange?.[1]) {
                submitValue.RegisterEndDate = dayjs(values.RegisterDateRange[1]).format('YYYY-MM-DD HH:mm:ss');
            }

            // Format AuctionDateRange thành AuctionStartDate và AuctionEndDate - chỉ khi có giá trị (bắt buộc)
            if (values.AuctionDateRange?.[0]) {
                submitValue.AuctionStartDate = dayjs(values.AuctionDateRange[0]).format('YYYY-MM-DD HH:mm:ss');
            }
            if (values.AuctionDateRange?.[1]) {
                submitValue.AuctionEndDate = dayjs(values.AuctionDateRange[1]).format('YYYY-MM-DD HH:mm:ss');
            }

            // Thêm các file nếu có (không bắt buộc)
            if (values.AuctionAssetFile?.fileList?.[0]?.originFileObj) {
                submitValue.AuctionAssetFile = values.AuctionAssetFile.fileList[0].originFileObj;
            }
            if (values.AuctionRulesFile?.fileList?.[0]?.originFileObj) {
                submitValue.AuctionRulesFile = values.AuctionRulesFile.fileList[0].originFileObj;
            }
            if (values.AuctionPlanningMap?.fileList?.[0]?.originFileObj) {
                submitValue.AuctionPlanningMap = values.AuctionPlanningMap.fileList[0].originFileObj;
            }
            if (values.Auction_Map?.fileList?.[0]?.originFileObj) {
                submitValue.Auction_Map = values.Auction_Map.fileList[0].originFileObj;
            }

            console.log("Submit values:", submitValue);

            // Tạo FormData để gửi files cùng với data
            const formData = new FormData();

            // Thêm các field non-file vào FormData
            Object.keys(submitValue).forEach(key => {
                if (submitValue[key] !== null && submitValue[key] !== undefined) {
                    // Nếu là file thì append trực tiếp, nếu không thì convert sang string
                    if (submitValue[key] instanceof File) {
                        formData.append(key, submitValue[key]);
                    } else {
                        formData.append(key, String(submitValue[key]));
                    }
                }
            });

            const response = await AuctionServices.updateAuction(formData);
            if (response.code === 200) {
                toast.success(response.message);
            } else {
                toast.error("Cập nhật phiên đấu giá thất bại")
            }

        } catch (error: any) {
            toast.error("Có lỗi xảy ra khi cập nhật!", error);
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

        // Auction start must be at least 3 days after register end
        const minDays = registerEnd.add(3, 'day');

        if (auctionStart <= minDays) {
            return Promise.reject(new Error('Thời gian bắt đầu đấu giá phải sau ngày kết thúc đăng ký ít nhất 3 ngày!'));
        }

        return Promise.resolve();
    };

    const uploadProps = {
        beforeUpload: () => false, // Prevent auto upload
        maxCount: 1,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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

                        <Col xs={24} lg={12}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                            >
                                <Form.Item
                                    name="NumberRoundMax"
                                    label={<span className="!font-medium !text-blue-900">Số vòng tối đa</span>}
                                    rules={[
                                        { required: true, message: "Vui lòng nhập số vòng tối đa!" },
                                        {
                                            validator: (_, value) => {
                                                const num = Number(value);
                                                if (isNaN(num) || num < 1 || num > 5) {
                                                    return Promise.reject(new Error('Số vòng tối đa phải từ 1 đến 5 vòng!'));
                                                }
                                                return Promise.resolve();
                                            }
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

                        <Col span={24}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Form.Item
                                    name="AuctionDescription"
                                    label={<span className="!font-medium !text-blue-900">Mô tả đấu giá</span>}
                                    rules={[{ required: true, message: "Vui lòng nhập mô tả đấu giá!" }]}
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

                        {/* Assets List */}
                        <Col span={24}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.0 }}
                            >
                                <h3 className="!text-lg !font-semibold !text-blue-800 !mb-4 !border-b !border-blue-200 !pb-2">
                                    Các tài sản đang có
                                </h3>
                            </motion.div>
                        </Col>

                        <Col span={24}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1 }}
                            >
                                {auctionDetailData?.listAuctionAssets && auctionDetailData.listAuctionAssets.length > 0 ? (
                                    <div className="space-y-4">
                                        {auctionDetailData.listAuctionAssets.map((asset, index) => (
                                            <div
                                                key={asset.auctionAssetsId || index}
                                                className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                                            <span className="font-semibold text-blue-800">Tên tài sản:</span>
                                                        </div>
                                                        <p className="text-gray-700 ml-5">{asset.tagName || "Chưa có tên"}</p>

                                                        <div className="flex items-center gap-2">
                                                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                                            <span className="font-semibold text-green-800">Giá khởi điểm:</span>
                                                        </div>
                                                        <p className="text-gray-700 ml-5">
                                                            {asset.startingPrice ? `${parseFloat(asset.startingPrice).toLocaleString("vi-VN")} VND` : "Chưa xác định"}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                                                            <span className="font-semibold text-purple-800">Đơn vị:</span>
                                                        </div>
                                                        <p className="text-gray-700 ml-5">{asset.unit || "Chưa xác định"}</p>

                                                        <div className="flex items-center gap-2">
                                                            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                                                            <span className="font-semibold text-orange-800">Tiền đặt trước:</span>
                                                        </div>
                                                        <p className="text-gray-700 ml-5">
                                                            {asset.deposit ? `${parseFloat(asset.deposit).toLocaleString("vi-VN")} VND` : "Chưa xác định"}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                                            <span className="font-semibold text-red-800">Phí đăng ký:</span>
                                                        </div>
                                                        <p className="text-gray-700 ml-5">
                                                            {asset.registrationFee ? `${parseFloat(asset.registrationFee).toLocaleString("vi-VN")} VND` : "Chưa xác định"}
                                                        </p>

                                                        {asset.description && (
                                                            <>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                                                                    <span className="font-semibold text-gray-800">Mô tả:</span>
                                                                </div>
                                                                <p className="text-gray-700 ml-5 text-sm">{asset.description}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                                            <FileTextOutlined className="text-3xl text-gray-500" />
                                        </div>
                                        <h4 className="text-xl font-semibold text-gray-600 mb-2">
                                            Chưa có tài sản
                                        </h4>
                                        <p className="text-gray-500">
                                            Không có tài sản đấu giá nào được thêm vào phiên này.
                                        </p>
                                    </div>
                                )}
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
                                            {auctionDetailData?.auctionRules && (
                                                <Typography.Link
                                                    href={auctionDetailData?.auctionRules}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl ml-4"
                                                >
                                                    <EyeOutlined />
                                                    Xem hiện tại
                                                </Typography.Link>
                                            )}
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
                                                    {auctionDetailData?.auctionPlanningMap && (
                                                        <Typography.Link
                                                            href={auctionDetailData?.auctionPlanningMap}
                                                            target="_blank"
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl ml-4"
                                                        >
                                                            <EyeOutlined />
                                                            Xem hiện tại
                                                        </Typography.Link>
                                                    )}
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
                                                    {auctionDetailData?.auctionMap && (
                                                        <Typography.Link
                                                            href={auctionDetailData?.auctionMap}
                                                            target="_blank"
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl ml-4"
                                                        >
                                                            <EyeOutlined />
                                                            Xem hiện tại
                                                        </Typography.Link>
                                                    )}
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
            </Card >
        </motion.div >
    );
};

export default UpdateAuction;
