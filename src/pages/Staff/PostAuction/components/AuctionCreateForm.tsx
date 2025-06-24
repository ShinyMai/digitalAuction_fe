/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import MapComponent from "./MapComponent";
import { useState, useEffect } from "react";
import UploadFile from "./Upload";
import TinyMCEEditor from "./TinyMCEEditor";
import type { AuctionCategory } from "../../Modals.ts";
import dayjs from "dayjs";
import AuctionServices from "../../../../services/AuctionServices/index.tsx";

const { RangePicker } = DatePicker;

interface Props {
    auctionCategoryList: AuctionCategory[];
}

const AuctionCreateForm = ({ auctionCategoryList }: Props) => {
    const [form] = useForm();
    const [isRealEstate, setIsRealEstate] = useState(false);
    const [loading, setLoading] = useState(false);
    const dataAuctionCategoryList = auctionCategoryList.map((val) => ({
        value: val.categoryId,
        label: val.categoryName,
    }));

    // Lấy ngày hiện tại (23/06/2025 22:25 +07)
    const currentDate = dayjs();

    // State để lưu giá trị thời gian đăng ký
    const [registerRange, setRegisterRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

    // Hàm disable ngày cho RangePicker thời gian đăng ký
    const disabledRegisterDate = (current: dayjs.Dayjs) => {
        return current.isBefore(currentDate.startOf('day'));
    };

    // Hàm disable ngày cho RangePicker thời gian đấu giá
    const disabledAuctionDate = (current: dayjs.Dayjs) => {
        if (!registerRange || !registerRange[1]) return false; // Chỉ disable khi có ngày kết thúc đăng ký
        const registerEndDate = registerRange[1];
        const minAuctionStart = registerEndDate.add(1, 'day'); // Ngày bắt đầu tối thiểu (1 ngày sau)
        return current.isBefore(minAuctionStart);
    };

    // Hàm tạo FormData từ form values và các file
    const createFormData = (
        formValues: {
            AuctionName?: string;
            CategoryId?: number;
            RegisterOpenDate?: string;
            RegisterEndDate?: string;
            AuctionStartDate?: string;
            AuctionEndDate?: string;
            NumberRoundMax?: string;
            AuctionDescription?: string;
            AuctionAssetFile: File;
            AuctionRulesFile: File;
            AuctionPlanningMap?: any[];
            AuctionMap?: any;
            auctionPlanningMapFile?: File
        },

    ): FormData => {
        const formData = new FormData();

        // Define the fields to include in FormData
        const fields = {
            AuctionName: formValues.AuctionName,
            CategoryId: formValues.CategoryId,
            RegisterOpenDate: formValues.RegisterOpenDate,
            RegisterEndDate: formValues.RegisterEndDate,
            AuctionStartDate: formValues.AuctionStartDate,
            AuctionEndDate: formValues.AuctionEndDate,
            NumberRoundMax: formValues.NumberRoundMax,
            AuctionDescription: formValues.AuctionDescription,
            AuctionMap: formValues.AuctionMap,
        };

        // Append non-file fields to FormData
        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                // Stringify objects (e.g., AuctionMap or AuctionDescription if they are objects)
                formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
            }
        });

        // Append required files
        formData.append('AuctionAssetFile', formValues.AuctionAssetFile);
        formData.append('AuctionRulesFile', formValues.AuctionRulesFile);

        // Append optional file if it exists
        if (formValues.auctionPlanningMapFile) {
            formData.append('AuctionPlanningMap', formValues.auctionPlanningMapFile);
        }

        return formData;
    };

    useEffect(() => {
        form.setFieldsValue({ AuctionTimeRange: null }); // Reset thời gian đấu giá khi thay đổi đăng ký
    }, [registerRange, form]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const auctionAssetFile = values.AuctionAssetFile?.[0]?.originFileObj;
            const auctionRulesFile = values.AuctionRulesFile?.[0]?.originFileObj;
            const auctionPlanningMapFile = values.AuctionPlanningMap?.[0]?.originFileObj; // Optional file

            if (!auctionAssetFile || !auctionRulesFile) {
                message.error("Vui lòng tải lên đầy đủ các tệp bắt buộc!");
                setLoading(false);
                return;
            }

            const [registerOpenDate, registerEndDate] = values.RegisterTimeRange || [];
            if (!registerOpenDate || !registerEndDate) {
                message.error("Vui lòng chọn thời gian đăng ký!");
                setLoading(false);
                return;
            }

            const [auctionStartDate, auctionEndDate] = values.AuctionTimeRange || [];
            if (!auctionStartDate || !auctionEndDate) {
                message.error("Vui lòng chọn thời gian đấu giá!");
                setLoading(false);
                return;
            }

            // Chuyển đổi sang dayjs để tính toán
            const registerEnd = dayjs(registerEndDate);
            const auctionStart = dayjs(auctionStartDate);

            // Kiểm tra khoảng cách từ 1 đến 3 ngày giữa registerEndDate và auctionStartDate
            //const daysDifference = auctionStart.diff(registerEnd, 'day');
            // if (daysDifference < 1 || daysDifference > 3) {
            //     message.error("Thời gian bắt đầu đấu giá phải sau thời gian kết thúc đăng ký từ 1 đến 3 ngày!");
            //     setLoading(false);
            //     return;
            // }
            const registerStart = dayjs(registerOpenDate);
            const dayDifferStart = auctionStart.diff(registerStart, 'day')
            if (dayDifferStart < 7) {
                message.error("Thời gian bắt đầu đấu giá phải trước thời gian bắt đầu đăng ký tham gia ít nhất 7 ngày!");
                setLoading(false);
                return;
            }
            //console.log("Form submitted successfully:", auctionAssetFile);
            const formattedValues = {
                ...values,
                AuctionAssetFile: auctionAssetFile,
                AuctionRulesFile: auctionRulesFile,
                RegisterOpenDate: dayjs(registerOpenDate).format("YYYY-MM-DD"),
                RegisterEndDate: dayjs(registerEndDate).format("YYYY-MM-DD"),
                AuctionStartDate: dayjs(auctionStartDate).format("YYYY-MM-DD"),
                AuctionEndDate: dayjs(auctionEndDate).format("YYYY-MM-DD"),
            };

            delete formattedValues.RegisterTimeRange;
            delete formattedValues.AuctionTimeRange;

            // Create FormData using the separate function
            const formData = createFormData(formattedValues);

            // Call the API with FormData
            await AuctionServices.addAcution(formData);

            message.success("Tạo đấu giá thành công!");
        } catch (error: any) {
            console.error("Error submitting form:", error);
            message.error(`Tạo đấu giá thất bại: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            className="space-y-6"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={(err) => {
                console.log("Validation failed:", err);
                message.error("Vui lòng kiểm tra các trường bắt buộc!");
            }}
            onValuesChange={(changedValues, allValues) => {
                if (changedValues.RegisterTimeRange) {
                    setRegisterRange(changedValues.RegisterTimeRange);
                }
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={8}>
                    <Card
                        title="Thông Tin Đấu Giá"
                        className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <Form.Item
                            label="Tên đấu giá"
                            name="AuctionName"
                            rules={[{ required: true, message: "Vui lòng nhập tên đấu giá!" }]}
                        >
                            <Input
                                className="w-full border-teal-200 bg-white rounded-lg p-2 focus:border-teal-300"
                                placeholder="Nhập tên đấu giá"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Danh mục tài sản"
                            name="CategoryId"
                            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                        >
                            <Select
                                className="w-full border-teal-200 bg-white rounded-lg"
                                placeholder="Chọn danh mục"
                                options={dataAuctionCategoryList}
                                onSelect={(val) => setIsRealEstate(val === 1)}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Số vòng tối đa"
                            name="NumberRoundMax"
                            rules={[{ required: true, message: "Vui lòng nhập số vòng tối đa!" }]}
                        >
                            <Input
                                className="w-full border-teal-200 bg-white rounded-lg p-2 focus:border-teal-300"
                                placeholder="Nhập số vòng tối đa"
                                type="number"
                                max={5}
                                min={1}
                            />
                        </Form.Item>
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={8}>
                    <Card
                        title="Thời Gian"
                        className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <Form.Item
                            label="Thời gian đăng ký"
                            name="RegisterTimeRange"
                            rules={[{ required: true, message: "Vui lòng chọn thời gian đăng ký!" }]}
                        >
                            <RangePicker
                                className="w-full border-teal-200 bg-white rounded-lg p-2 focus:border-teal-300"
                                format="DD/MM/YYYY"
                                placeholder={["Ngày mở đăng ký", "Ngày kết thúc đăng ký"]}
                                disabledDate={disabledRegisterDate}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Thời gian đấu giá"
                            name="AuctionTimeRange"
                            rules={[{ required: true, message: "Vui lòng chọn thời gian đấu giá!" }]}
                        >
                            <RangePicker
                                className="w-full border-teal-200 bg-white rounded-lg p-2 focus:border-teal-300"
                                format="DD/MM/YYYY"
                                placeholder={["Ngày bắt đầu đấu giá", "Ngày kết thúc đấu giá"]}
                                disabledDate={disabledAuctionDate}
                            />
                        </Form.Item>
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={8}>
                    <Card
                        title="Tệp Tài Liệu"
                        className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <Form.Item
                            label="Tệp tài sản đấu giá"
                            name="AuctionAssetFile"
                            rules={[{ required: true, message: "Vui lòng tải lên tệp tài sản!" }]}
                            valuePropName="fileList"
                        >
                            <UploadFile contentName="AuctionAssetFile" />
                        </Form.Item>
                        <Form.Item
                            label="Tệp quy tắc đấu giá"
                            name="AuctionRulesFile"
                            rules={[{ required: true, message: "Vui lòng tải lên tệp quy tắc!" }]}
                            valuePropName="fileList"
                        >
                            <UploadFile contentName="AuctionRulesFile" />
                        </Form.Item>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} className="mt-6">
                <Col xs={24} lg={isRealEstate ? 12 : 24}>
                    <Card
                        title="Mô tả Đấu Giá"
                        className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <Form.Item
                            name="AuctionDescription"
                            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                        >
                            <TinyMCEEditor height={300} />
                        </Form.Item>
                    </Card>
                </Col>
                {isRealEstate && (
                    <Col xs={24} lg={12}>
                        <Card
                            title="Bản Đồ Kế Hoạch"
                            className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <Form.Item
                                label="Bản đồ kế hoạch đấu giá"
                                name="AuctionPlanningMap"
                                valuePropName="fileList"
                            >
                                <UploadFile contentName="AuctionPlanningMap" />
                            </Form.Item>
                            <Form.Item label="Vị trí trên bản đồ" name="AuctionMap">
                                <MapComponent
                                    isSearchMode={true}
                                    value="Hoa Lư, Ninh Bình, Việt Nam"
                                    name="AuctionMap"
                                    popupText="Vị trí đấu giá"
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                )}
            </Row>

            <Form.Item className="text-center mt-6">
                <Button
                    htmlType="submit"
                    type="primary"
                    loading={loading}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                    Tạo Đấu Giá
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AuctionCreateForm;