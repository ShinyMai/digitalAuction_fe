import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import MapComponent from "./MapComponent";
import { useState, useEffect } from "react";
import UploadFile from "./Upload";
import TinyMCEEditor from "./TinyMCEEditor";
import type { AuctionCategory } from "../../Modals.ts";
import dayjs, { Dayjs } from "dayjs";
import AuctionServices from "../../../../services/AuctionServices/index.tsx";

const { RangePicker } = DatePicker;

// Định nghĩa interface cho dữ liệu form
interface AuctionFormValues {
    AuctionName: string;
    CategoryId: number;
    NumberRoundMax: number;
    RegisterTimeRange?: [Dayjs, Dayjs];
    AuctionTimeRange?: [Dayjs, Dayjs];
    AuctionAssetFile?: { originFileObj: File; name: string }[];
    AuctionRulesFile?: { originFileObj: File; name: string }[];
    AuctionPlanningMap?: { originFileObj: File; name: string }[];
    AuctionDescription?: string;
    AuctionMap?: string;
}

interface Props {
    auctionCategoryList: AuctionCategory[];
}

const REAL_ESTATE_CATEGORY_ID = 1; // Hằng số cho danh mục bất động sản

const AuctionCreateForm = ({ auctionCategoryList }: Props) => {
    const [form] = useForm<AuctionFormValues>();
    const [isRealEstate, setIsRealEstate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registerRange, setRegisterRange] = useState<[Dayjs, Dayjs] | null>(null);

    // Chuyển danh sách danh mục thành options cho Select
    const dataAuctionCategoryList = auctionCategoryList.map((val) => ({
        value: val.categoryId,
        label: val.categoryName,
    }));

    // Lấy ngày hiện tại
    const currentDate = dayjs();

    // Hàm vô hiệu hóa ngày cho RangePicker thời gian đăng ký
    const disabledRegisterDate = (current: Dayjs) => {
        return current.isBefore(currentDate.startOf("day"));
    };

    // Hàm vô hiệu hóa ngày cho RangePicker thời gian đấu giá
    const disabledAuctionDate = (current: Dayjs) => {
        if (!registerRange || !registerRange[1]) return true;
        const registerEndDate = registerRange[1];
        const minAuctionStart = registerEndDate.add(1, "day").startOf("day");
        const maxAuctionEnd = registerEndDate.add(3, "day").endOf("day");
        return current.isBefore(minAuctionStart);
    };

    // Reset thời gian đấu giá khi thay đổi thời gian đăng ký
    useEffect(() => {
        if (registerRange && form.getFieldValue("AuctionTimeRange")) {
            const [auctionStartDate] = form.getFieldValue("AuctionTimeRange") || [];
            const registerEndDate = registerRange[1];
            const minAuctionStart = registerEndDate.add(1, "day");
            if (dayjs(auctionStartDate).isBefore(minAuctionStart)) {
                form.setFieldValue("AuctionTimeRange", null);
            }
        }
    }, [registerRange, form]);

    // Hàm xử lý submit form
    const onFinish = async (values: AuctionFormValues) => {
        setLoading(true);
        try {
            // Kiểm tra file bắt buộc
            if (!values.AuctionAssetFile || values.AuctionAssetFile.length !== 1) {
                message.error("Vui lòng tải lên đúng một tệp tài sản đấu giá!");
                return;
            }
            if (!values.AuctionRulesFile || values.AuctionRulesFile.length !== 1) {
                message.error("Vui lòng tải lên đúng một tệp quy tắc đấu giá!");
                return;
            }

            // Kiểm tra thời gian
            const [registerOpenDate, registerEndDate] = values.RegisterTimeRange || [];
            const [auctionStartDate, auctionEndDate] = values.AuctionTimeRange || [];
            if (!registerOpenDate || !registerEndDate || !auctionStartDate || !auctionEndDate) {
                message.error("Vui lòng chọn đầy đủ thời gian đăng ký và đấu giá!");
                return;
            }

            // Kiểm tra khoảng cách 1-3 ngày
            const daysDifference = dayjs(auctionStartDate).diff(dayjs(registerEndDate), "day");
            if (daysDifference < 1 || daysDifference > 3) {
                message.error("Thời gian bắt đầu đấu giá phải sau thời gian kết thúc đăng ký từ 1 đến 3 ngày!");
                return;
            }

            // Định dạng dữ liệu
            const formattedValues = {
                ...values,
                RegisterOpenDate: dayjs(registerOpenDate).format("YYYY-MM-DD"),
                RegisterEndDate: dayjs(registerEndDate).format("YYYY-MM-DD"),
                AuctionStartDate: dayjs(auctionStartDate).format("YYYY-MM-DD"),
                AuctionEndDate: dayjs(auctionEndDate).format("YYYY-MM-DD"),
            };

            delete formattedValues.RegisterTimeRange;
            delete formattedValues.AuctionTimeRange;

            // Gửi API
            await AuctionServices.addAuction(appendFormData(formattedValues));
            console.log("checjk:", appendFormData(formattedValues).values())
            message.success("Tạo đấu giá thành công!");
            // form.resetFields(); // Reset form sau khi thành công
        } catch (error: any) {
            console.error("Lỗi khi tạo đấu giá:", error);
            let errorMessage = "Lỗi hệ thống, vui lòng thử lại!";
            if (error.response?.status === 401) {
                errorMessage = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!";
                // Có thể thêm logic redirect nếu cần
                // window.location.href = '/login';
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data.message || "Dữ liệu không hợp lệ!";
            } else if (error.message === "Network Error") {
                errorMessage = "Lỗi kết nối mạng, vui lòng kiểm tra kết nối!";
            }
            message.error(`Tạo đấu giá thất bại: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // Hàm tạo FormData từ dữ liệu form
    const appendFormData = (val: AuctionFormValues & {
        RegisterOpenDate: string;
        RegisterEndDate: string;
        AuctionStartDate: string;
        AuctionEndDate: string;
    }) => {
        const formData = new FormData();
        formData.append("AuctionName", val.AuctionName);
        formData.append("CategoryId", val.CategoryId.toString());
        formData.append("Status", "draft"); // Trạng thái mặc định
        formData.append("NumberRoundMax", val.NumberRoundMax.toString());
        formData.append("AuctionDescription", val.AuctionDescription || "");
        formData.append("RegisterOpenDate", val.RegisterOpenDate);
        formData.append("RegisterEndDate", val.RegisterEndDate);
        formData.append("AuctionStartDate", val.AuctionStartDate);
        formData.append("AuctionEndDate", val.AuctionEndDate);

        // Thêm file
        if (val.AuctionAssetFile?.[0]?.originFileObj) {
            formData.append("AuctionAssetFile", val.AuctionAssetFile[0].originFileObj, val.AuctionAssetFile[0].name);
        }
        if (val.AuctionRulesFile?.[0]?.originFileObj) {
            formData.append("AuctionRulesFile", val.AuctionRulesFile[0].originFileObj, val.AuctionRulesFile[0].name);
        }
        if (val.AuctionPlanningMap?.[0]?.originFileObj) {
            formData.append("AuctionPlanningMap", val.AuctionPlanningMap[0].originFileObj, val.AuctionPlanningMap[0].name);
        }

        return formData;
    };

    return (
        <Form
            form={form}
            className="space-y-6"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={() => {
                message.error("Vui lòng kiểm tra các trường bắt buộc!");
            }}
            onValuesChange={(changedValues) => {
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
                                onSelect={(val) => setIsRealEstate(val === REAL_ESTATE_CATEGORY_ID)}
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
                                disabled={!registerRange} // Vô hiệu hóa nếu chưa chọn thời gian đăng ký
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