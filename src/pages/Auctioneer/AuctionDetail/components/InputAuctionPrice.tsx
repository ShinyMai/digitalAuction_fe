/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Form, Input, Button, Table, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

export interface InputAuctionPriceModals {
    citizenIdentification?: string;
    auctionAssetId?: string;
    auctionAssetName?: string;
    price: number;
}

const InputAuctionPrice: React.FC = () => {
    // State cho danh sách dữ liệu
    const [auctionList, setAuctionList] = useState<InputAuctionPriceModals[]>([]);

    // Form instance từ antd
    const [form] = Form.useForm();

    // Xử lý submit form
    const onFinish = (values: InputAuctionPriceModals) => {
        // Chuyển price thành number
        const formattedValues = {
            ...values,
            price: parseFloat(values.price as unknown as string),
        };

        // Thêm dữ liệu vào danh sách
        setAuctionList([...auctionList, formattedValues]);

        // Reset form
        form.resetFields();
    };

    // Xử lý xóa hàng
    const handleDelete = (index: number) => {
        setAuctionList(auctionList.filter((_, i) => i !== index));
    };

    // Cấu hình cột cho Table của antd
    const columns = [
        {
            dataIndex: 'citizenIdentification',
            key: 'citizenIdentification',
            render: (text: string) => text || '-',
        },
        {
            dataIndex: 'auctionAssetId',
            key: 'auctionAssetId',
            render: (text: string) => text || '-',
        },
        {
            dataIndex: 'auctionAssetName',
            key: 'auctionAssetName',
            render: (text: string) => text || '-',
        },
        {
            dataIndex: 'price',
            key: 'price',
            render: (text: number) => text.toLocaleString(),
        },
        {
            key: 'action',
            render: (_: any, __: InputAuctionPriceModals, index: number) => (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700"
                    />
                </div>
            ),
        },
    ];

    // Cấu hình phân trang
    const paginationConfig = auctionList.length > 5 ? { pageSize: 5 } : false;

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <Row gutter={[16, 16]}>
                {/* Form nhập liệu bên trái - 1/3 màn hình */}
                <Col xs={24} md={8}>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            className="w-full"
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24}>
                                    <Form.Item
                                        name="citizenIdentification"
                                        label="Citizen Identification"
                                    >
                                        <Input
                                            placeholder="Enter Citizen Identification"
                                            className="rounded-md"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item name="auctionAssetId" label="Auction Asset ID">
                                        <Input
                                            placeholder="Enter Auction Asset ID"
                                            className="rounded-md"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item name="auctionAssetName" label="Auction Asset Name">
                                        <Input
                                            placeholder="Enter Auction Asset Name"
                                            className="rounded-md"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        name="price"
                                        label="Price"
                                        rules={[
                                            { required: true, message: 'Price is required' },
                                            {
                                                validator: (_, value) =>
                                                    value && parseFloat(value) > 0
                                                        ? Promise.resolve()
                                                        : Promise.reject('Price must be a positive number'),
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="number"
                                            placeholder="Enter Price"
                                            className="rounded-md"
                                            min="0"
                                            step="0.01"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<PlusOutlined />}
                                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 border-none"
                                >
                                    Add
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>

                {/* Bảng dữ liệu bên phải - 2/3 màn hình */}
                <Col xs={24} md={16}>
                    <div className="bg-white shadow-md rounded-lg p-6 h-full">
                        <Table
                            dataSource={auctionList}
                            columns={columns}
                            rowKey={(record, index) => index?.toString() || ''}
                            locale={{ emptyText: 'No data available' }}
                            pagination={paginationConfig}
                            className="w-full"
                            rowClassName="group"
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default InputAuctionPrice;