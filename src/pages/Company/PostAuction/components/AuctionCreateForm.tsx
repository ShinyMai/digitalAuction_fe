import { Col, Form, Input, Row, Select, DatePicker, Card, Button, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import MapComponent from "./MapComponent";
import { AuctionCategories } from "../../DataConst";
import { useState } from "react";
import UploadFile from "./Upload";

const AuctionCreateForm = () => {
    const [form] = useForm();
    const [isRealEstate, setIsRealEstate] = useState(false);
    const [loading, setLoading] = useState(false);
    const auctionCategoryList = AuctionCategories.map((val) => ({
        value: val.CategoryId,
        label: val.CategoryName,
    }));

    // Hàm upload file lên server
    const uploadFileToServer = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch("https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload", {
                method: "POST",
                headers: {
                    authorization: "authorization-text",
                },
                body: formData,
            });
            if (!response.ok) throw new Error("Upload failed");
            return await response.json();
        } catch (error: any) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    };

    // Hàm xử lý submit form
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Kiểm tra fileList
            const auctionAssetFile = values.AuctionAssetFile?.[0]?.originFileObj;
            const auctionRulesFile = values.AuctionRulesFile?.[0]?.originFileObj;
            const auctionPlanningMap = values.AuctionPlanningMap?.[0]?.originFileObj;

            if (!auctionAssetFile || !auctionRulesFile) {
                message.error("Vui lòng tải lên đầy đủ các tệp bắt buộc!");
                setLoading(false);
                return;
            }

            // Upload files
            // await Promise.all([
            //     auctionAssetFile && uploadFileToServer(auctionAssetFile),
            //     auctionRulesFile && uploadFileToServer(auctionRulesFile),
            //     auctionPlanningMap && uploadFileToServer(auctionPlanningMap),
            // ].filter(Boolean));

            console.log("Form submitted successfully:", values);
            message.success("Tạo đấu giá thành công!");
        } catch (error: any) {
            console.error("Error uploading files:", error);
            message.error(`Tạo đấu giá thất bại: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Form
                form={form}
                className="w-full"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={(err) => {
                    console.log("Validation failed:", err);
                    message.error("Vui lòng kiểm tra các trường bắt buộc!");
                }}
            >
                <Row gutter={[16, 16]} className="w-full">
                    <Col xs={24} md={12} lg={8}>
                        <Card title="Thông Tin Đấu Giá" className="form-card">
                            <Form.Item
                                label="Tên đấu giá"
                                name="AuctionName"
                                rules={[{ required: true, message: "Vui lòng nhập tên đấu giá!" }]}
                            >
                                <Input className="custom-input" placeholder="Nhập tên đấu giá" />
                            </Form.Item>
                            <Form.Item
                                label="Danh mục tài sản"
                                name="CategoryId"
                                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                            >
                                <Select
                                    className="custom-input"
                                    placeholder="Chọn danh mục"
                                    options={auctionCategoryList}
                                    onSelect={(val) => setIsRealEstate(val === 2)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Trạng thái"
                                name="Status"
                                rules={[{ required: true, message: "Vui lòng nhập trạng thái!" }]}
                            >
                                <Input className="custom-input" placeholder="Nhập trạng thái" />
                            </Form.Item>
                            <Form.Item
                                label="Số vòng tối đa"
                                name="NumberRoundMax"
                                rules={[{ required: true, message: "Vui lòng nhập số vòng tối đa!" }]}
                            >
                                <Input
                                    className="custom-input"
                                    placeholder="Nhập số vòng tối đa"
                                    type="number"
                                    max={5}
                                    min={1}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Mô tả đấu giá"
                                name="AuctionDescription"
                                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                            >
                                <TextArea rows={4} placeholder="Mô tả chi tiết về đấu giá" />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col xs={24} md={12} lg={8}>
                        <Card title="Thời Gian" className="form-card">
                            <Form.Item
                                label="Ngày mở đăng ký"
                                name="RegisterOpenDate"
                                rules={[{ required: true, message: "Vui lòng chọn ngày mở đăng ký!" }]}
                            >
                                <DatePicker className="custom-input" format="DD/MM/YYYY" placeholder="Chọn ngày mở đăng ký" />
                            </Form.Item>
                            <Form.Item
                                label="Ngày kết thúc đăng ký"
                                name="RegisterEndDate"
                                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc đăng ký!" }]}
                            >
                                <DatePicker className="custom-input" format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc đăng ký" />
                            </Form.Item>
                            <Form.Item
                                label="Ngày bắt đầu đấu giá"
                                name="AuctionStartDate"
                                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu đấu giá!" }]}
                            >
                                <DatePicker className="custom-input" format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu đấu giá" />
                            </Form.Item>
                            <Form.Item
                                label="Ngày kết thúc đấu giá"
                                name="AuctionEndDate"
                                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc đấu giá!" }]}
                            >
                                <DatePicker className="custom-input" format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc đấu giá" />
                            </Form.Item>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Card title="Tệp và Bản Đồ" className="form-card">
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
                            {isRealEstate && (
                                <>
                                    <Form.Item
                                        label="Bản đồ kế hoạch đấu giá"
                                        name="AuctionPlanningMap"
                                        valuePropName="fileList"
                                    >
                                        <UploadFile contentName="AuctionPlanningMap" />
                                    </Form.Item>
                                    <Form.Item label="Vị trí trên bản đồ" name="AuctionMap">
                                        <MapComponent isSearchMode={true} value="Hoa Lư, Ninh Bình, Việt Nam" name="AuctionMap" popupText="Vị trí đấu giá" />
                                    </Form.Item>
                                </>
                            )}
                        </Card>
                    </Col>
                </Row>
                <Form.Item className="text-center mt-6">
                    <Button htmlType="submit" type="primary" loading={loading}>
                        Tạo Đấu Giá
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AuctionCreateForm;