import { useEffect, useState } from "react";
import type { AuctionAsset } from "../../Modals";
import { useSelector } from "react-redux";
import UserServices from "../../../../services/UserServices";
import { Form, Input, Button, message, Row, Col, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";

interface Props {
    listAuctionAssetsSelected: AuctionAsset[];
    onNext: () => void;
    onPrev: () => void;
}

const InfomationRegisterAsset = ({ listAuctionAssetsSelected, onNext, onPrev }: Props) => {
    const { user } = useSelector((state: any) => state.auth);
    const [userInfo, setUserInfo] = useState<any>();
    const [form] = useForm();

    const getUserInfo = async () => {
        try {
            const res = await UserServices.getUserInfo({
                user_id: user.id,
            });

            if (res.code === 200) {
                setUserInfo(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, [user]);

    useEffect(() => {
        if (userInfo) {
            form.setFieldsValue({
                name: userInfo.name,
                birthDay: userInfo.birthDay ? dayjs(userInfo.birthDay) : null,
                citizenIdentification: userInfo.citizenIdentification,
                issueDate: userInfo.issueDate ? dayjs(userInfo.issueDate) : null,
                issueBy: userInfo.issueBy,
                phoneNumber: userInfo.phoneNumber,
                originLocation: userInfo.originLocation,
                accountNumber: "",
                bankName: "",
            });
        }
    }, [userInfo, form]);

    const handleNext = async () => {
        try {
            await form.validateFields();
            onNext();
        } catch (error) {
            message.error("Vui lòng điền đầy đủ thông tin!");
        }
    };

    return (
        <section className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8">
                <Typography.Title level={2} className="text-center text-blue-800 mb-6">
                    Đăng Ký Tham Gia Đấu Giá
                </Typography.Title>

                <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} md={16}>
                        <Form
                            form={form}
                            layout="vertical"
                            className="bg-blue-50 p-6 rounded-lg shadow-md"
                        >
                            <Typography.Title level={4} className="text-blue-800 mb-4 px-2">
                                Thông Tin Cá Nhân
                            </Typography.Title>
                            <Row gutter={16} className="p-2">
                                <Col span={12}>
                                    <Form.Item
                                        label="Họ và tên:"
                                        name="name"
                                        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                                    >
                                        <Input placeholder="Nhập họ và tên" className="w-full" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Sinh ngày:"
                                        name="birthDay"
                                        rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
                                    >
                                        <Input placeholder="Nhập ngày sinh" type="date" className="w-full" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="CCCD số:"
                                        name="citizenIdentification"
                                        rules={[{ required: true, message: "Vui lòng nhập số CCCD!" }]}
                                    >
                                        <Input placeholder="Nhập số CCCD" className="w-full" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Cấp ngày:"
                                        name="issueDate"
                                        rules={[{ required: true, message: "Vui lòng nhập ngày cấp!" }]}
                                    >
                                        <Input placeholder="Nhập ngày cấp" type="date" className="w-full" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Nơi cấp:"
                                        name="issueBy"
                                        rules={[{ required: true, message: "Vui lòng nhập nơi cấp!" }]}
                                    >
                                        <Input placeholder="Nhập nơi cấp" className="w-full" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Điện thoại:"
                                        name="phoneNumber"
                                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                                    >
                                        <Input placeholder="Nhập số điện thoại" className="w-full" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="Hộ khẩu thường trú:"
                                        name="originLocation"
                                        rules={[{ required: true, message: "Vui lòng nhập hộ khẩu thường trú!" }]}
                                    >
                                        <Input.TextArea placeholder="Nhập hộ khẩu thường trú" rows={3} className="w-full" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Typography.Title level={4} className="text-blue-800 mt-6 mb-4 px-2">
                                Tài Khoản Nhận Lại Tiền Cọc
                            </Typography.Title>
                            <Row gutter={16} className="p-2">
                                <Col span={12}>
                                    <Form.Item
                                        label="Số tài khoản:"
                                        name="accountNumber"
                                        rules={[{ required: true, message: "Vui lòng nhập số tài khoản!" }]}
                                    >
                                        <Input placeholder="Nhập số tài khoản" className="w-full" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tên ngân hàng:"
                                        name="bankName"
                                        rules={[{ required: true, message: "Vui lòng nhập tên ngân hàng!" }]}
                                    >
                                        <Input placeholder="Nhập tên ngân hàng" className="w-full" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>

                    <Col xs={24} md={8}>
                        <div className="bg-blue-50 p-4 rounded-lg shadow-md h-full">
                            <Typography.Title level={4} className="text-blue-800 mb-4">
                                Tài Sản Đã Chọn
                            </Typography.Title>
                            {listAuctionAssetsSelected.length > 0 ? (
                                <div className="space-y-4">
                                    {listAuctionAssetsSelected.map((asset) => (
                                        <div
                                            key={asset.auctionAssetsId}
                                            className="border border-teal-200 p-3 rounded-lg hover:shadow-lg transition-shadow duration-300"
                                        >
                                            <Typography.Text strong className="text-teal-700">
                                                {asset.tagName || "Tài sản không tên"}
                                            </Typography.Text>
                                            <div className="text-sm text-gray-600 space-y-1 mt-2">
                                                <p>Giá khởi điểm: {formatVND(asset.startingPrice || "0")}</p>
                                                <p>Tiền đặt trước: {formatVND(asset.deposit || "0")}</p>
                                                <p>Phí đăng ký: {formatVND(asset.registrationFee || "0")}</p>
                                                <p>Đơn vị: {asset.unit || "-"}</p>
                                                <p>Mô tả: {asset.description || "Không có mô tả"}</p>
                                                <p>Ngày tạo: {dayjs(asset.createdAt).format("DD/MM/YYYY")}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-teal-600 py-4">Chưa chọn tài sản nào</div>
                            )}
                        </div>
                    </Col>
                </Row>

                <div className="mt-6 flex justify-between">
                    <Button className="bg-gray-200 hover:bg-gray-300" onClick={onPrev}>
                        Quay Lại
                    </Button>
                    <Button type="primary" className="bg-teal-500 hover:bg-teal-600" onClick={handleNext}>
                        Tiếp Theo
                    </Button>
                </div>
            </div>
        </section>
    );
};

const formatVND = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(number);
};

export default InfomationRegisterAsset;