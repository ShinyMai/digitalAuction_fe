/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Form, Input, Button, Table, Row, Col, Card, Typography, InputNumber } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  DollarOutlined,
  IdcardOutlined,
  HomeOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export interface InputAuctionPriceModals {
  citizenIdentification?: string;
  auctionAssetId?: string;
  auctionAssetName?: string;
  price: number;
}

const InputAuctionPrice: React.FC = () => {
  // State cho danh sách dữ liệu
  const [auctionList, setAuctionList] = useState<InputAuctionPriceModals[]>([]);
  const [loading, setLoading] = useState(false);

  // Form instance từ antd
  const [form] = Form.useForm();

  // Xử lý submit form
  const onFinish = async (values: InputAuctionPriceModals) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Chuyển price thành number
      const formattedValues = {
        ...values,
        price: values.price,
      };

      // Thêm dữ liệu vào danh sách
      setAuctionList([...auctionList, formattedValues]);

      // Reset form
      form.resetFields();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa hàng
  const handleDelete = (index: number) => {
    setAuctionList(auctionList.filter((_, i) => i !== index));
  };

  // Cấu hình cột cho Table của antd
  const columns = [
    {
      title: "CMND/CCCD",
      dataIndex: "citizenIdentification",
      key: "citizenIdentification",
      width: 150,
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <IdcardOutlined className="text-blue-500" />
          <Text className="font-medium">{text || "-"}</Text>
        </div>
      ),
    },
    {
      title: "Mã tài sản",
      dataIndex: "auctionAssetId",
      key: "auctionAssetId",
      width: 120,
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <HomeOutlined className="text-teal-500" />
          <Text className="font-medium">{text || "-"}</Text>
        </div>
      ),
    },
    {
      title: "Tên tài sản",
      dataIndex: "auctionAssetName",
      key: "auctionAssetName",
      width: 200,
      render: (text: string) => <Text className="font-medium text-gray-700">{text || "-"}</Text>,
    },
    {
      title: "Giá đấu (VND)",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (text: number) => (
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <Text className="font-bold text-green-600">{text?.toLocaleString("vi-VN")}</Text>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_: any, __: InputAuctionPriceModals, index: number) => (
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(index)}
            className="hover:scale-110 transition-transform duration-200"
            size="small"
          />
        </div>
      ),
    },
  ];

  // Cấu hình phân trang
  const paginationConfig =
    auctionList.length > 8
      ? {
          pageSize: 8,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} của ${total} mục`,
        }
      : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full animate-float delay-2000"></div>
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white mb-4">
            <TrophyOutlined className="text-xl" />
            <Title level={3} className="!text-white !mb-0">
              Nhập Giá Đấu Giá
            </Title>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Form nhập liệu bên trái */}
          <Col xs={24} lg={10}>
            <Card
              className="shadow-xl bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl transition-shadow duration-300"
              title={
                <div className="flex items-center gap-3 text-gray-800">
                  <span className="text-lg font-semibold">Nhập Thông Tin Đấu Giá</span>
                </div>
              }
            >
              <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
                <Form.Item
                  name="citizenIdentification"
                  label={
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <IdcardOutlined className="text-blue-500" />
                      Số CMND/CCCD
                    </span>
                  }
                  rules={[{ required: true, message: "Vui lòng nhập số CMND/CCCD" }]}
                >
                  <Input
                    placeholder="Nhập số CMND/CCCD"
                    className="rounded-lg h-12 border-gray-300 hover:border-blue-500 focus:border-blue-500"
                    prefix={<IdcardOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  name="auctionAssetId"
                  label={
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <HomeOutlined className="text-teal-500" />
                      Mã Tài Sản
                    </span>
                  }
                  rules={[{ required: true, message: "Vui lòng nhập mã tài sản" }]}
                >
                  <Input
                    placeholder="Nhập mã tài sản"
                    className="rounded-lg h-12 border-gray-300 hover:border-blue-500 focus:border-blue-500"
                    prefix={<HomeOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  name="auctionAssetName"
                  label={<span className="text-gray-700 font-medium">Tên Tài Sản</span>}
                  rules={[{ required: true, message: "Vui lòng nhập tên tài sản" }]}
                >
                  <Input
                    placeholder="Nhập tên tài sản"
                    className="rounded-lg h-12 border-gray-300 hover:border-blue-500 focus:border-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  name="price"
                  label={
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <DollarOutlined className="text-green-500" />
                      Giá Đấu (VND)
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập giá đấu" },
                    { type: "number", min: 1000, message: "Giá đấu phải lớn hơn 1,000 VND" },
                  ]}
                >
                  {" "}
                  <InputNumber
                    placeholder="Nhập giá đấu"
                    className="w-full rounded-lg h-12 border-gray-300 hover:border-blue-500 focus:border-blue-500"
                    min={1000}
                    step={1000}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    icon={<PlusOutlined />}
                  >
                    {loading ? "Đang thêm..." : "Thêm Giá Đấu"}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Bảng dữ liệu bên phải */}
          <Col xs={24} lg={14}>
            <Card
              className="shadow-xl bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl transition-shadow duration-300"
              title={
                <div className="flex items-center gap-3 text-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                    <TrophyOutlined className="text-white" />
                  </div>
                  <span className="text-lg font-semibold">Danh Sách Giá Đấu</span>
                </div>
              }
            >
              <Table
                dataSource={auctionList}
                columns={columns}
                rowKey={(_, index) => index?.toString() || ""}
                locale={{
                  emptyText: (
                    <div className="text-center py-12">
                      <TrophyOutlined className="text-6xl text-gray-300 mb-4" />
                      <Text className="text-gray-500 text-lg">Chưa có dữ liệu giá đấu</Text>
                      <br />
                      <Text className="text-gray-400">Thêm giá đấu đầu tiên của bạn</Text>
                    </div>
                  ),
                }}
                pagination={paginationConfig}
                className="rounded-lg overflow-hidden"
                rowClassName="group hover:bg-blue-50 transition-colors duration-200"
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
        
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
          font-weight: 600 !important;
          color: #374151 !important;
          border-bottom: 2px solid #e5e7eb !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: rgba(59, 130, 246, 0.05) !important;
        }
        
        .ant-card-head {
          border-bottom: 2px solid #e5e7eb !important;
        }
        
        .ant-input:focus, .ant-input-focused {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }
        
        .ant-input-number:focus, .ant-input-number-focused {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default InputAuctionPrice;
