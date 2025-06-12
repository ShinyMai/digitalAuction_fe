import {Button, Col, DatePicker, Form, Input, Row} from "antd";
import React, {useEffect} from "react";
import dayjs from "dayjs";

interface RegisterAccountFormProps {
    setCurrent: (current: number) => void;
    setAccount: (account: object) => void;
    account: any;
}

const RegisterAccountForm: React.FC<RegisterAccountFormProps> = ({
                                                                     setCurrent,
                                                                     setAccount,
                                                                     account,
                                                                 }) => {
    const [formRegister] = Form.useForm();

    useEffect(() => {
        if (account) {
            const filledData = {
                ...account,
                birthDay: account.birthDay ? dayjs(account.birthDay) : null,
                issueDate: account.issueDate ? dayjs(account.issueDate) : null,
                validDate: account.validDate ? dayjs(account.validDate) : null,
            };
            formRegister.setFieldsValue(filledData);
        }
    }, [account]);

    return (
        <div
            className="flex flex-col px-12 py-6 mx-8 mt-4 bg-white rounded-lg"
            style={{boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"}}
        >
            <h1 className="text-2xl font-bold mb-4 text-center">Thông tin tài khoản</h1>

            <Form layout="vertical" form={formRegister}>
                <Row gutter={16}>
                    <Col xs={24} sm={8}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {required: true, message: "Vui lòng nhập email hợp lệ"},
                                {type: "email", message: "Định dạng email không hợp lệ"},
                            ]}
                        >
                            <Input placeholder="example@example.com"/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                {required: true, message: "Vui lòng nhập mật khẩu"},
                            ]}
                        >
                            <Input.Password placeholder="Mật khẩu"/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            name="re-password"
                            label="Nhập lại Mật khẩu"
                            rules={[
                                {required: true, message: "Vui lòng nhập lại mật khẩu"},
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại Mật khẩu"/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{required: true, message: "Vui lòng nhập họ và tên"}]}
                        >
                            <Input placeholder="Họ và tên" disabled/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            name="citizenIdentification"
                            label="Số CCCD"
                            rules={[{required: true, message: "Vui lòng nhập số CCCD"}]}
                        >
                            <Input placeholder="Số CCCD" disabled/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item name="nationality" label="Quốc tịch" rules={[{required: true}]}>
                            <Input placeholder="Quốc tịch" disabled/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                {required: true, message: "Vui lòng nhập số điện thoại"},
                                {pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ"},
                            ]}
                        >
                            <Input placeholder="Số điện thoại"/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item name="gender" label="Giới tính" rules={[{required: true}]}>
                            <Input placeholder="Giới tính" disabled/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item name="birthDay" label="Ngày sinh" rules={[{required: true}]}>
                            <DatePicker format="YYYY/MM/DD" placeholder="Chọn ngày sinh" disabled/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={16}>
                        <Form.Item name="originLocation" label="Nguyên quán" rules={[{required: true}]}>
                            <Input placeholder="Nguyên quán" disabled/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={4}>
                        <Form.Item name="issueDate" label="Ngày cấp CCCD" rules={[{required: true}]}>
                            <DatePicker format="YYYY/MM/DD" placeholder="Ngày cấp CCCD" disabled/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={4}>
                        <Form.Item name="issueBy" label="Nơi cấp" rules={[{required: true}]}>
                            <Input placeholder="Nơi cấp" disabled/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={16}>
                        <Form.Item name="recentLocation" label="Hộ Khẩu Thường trú" rules={[{required: true}]}>
                            <Input placeholder="Thường trú" disabled/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item name="validDate" label="Ngày hết hạn CCCD" rules={[{required: true}]}>
                            <DatePicker format="YYYY/MM/DD" placeholder="Ngày hết hạn CCCD" disabled/>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button className="booking-btn" htmlType="submit">
                        Tạo tài khoản
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterAccountForm;
