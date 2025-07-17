/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Form, Input, Button, Table, Row, Col, AutoComplete, Select, Space } from "antd";
import { PlusOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import AuctionServices from "../../../../services/AuctionServices";

export interface InputAuctionPriceModals {
  citizenIdentification?: string;
  userName?: string;
  auctionAssetId?: string;
  auctionAssetName?: string;
  price: number;
  id: string;
}

interface props {
  auctionId: string;
}

interface AuctionAsset {
  auctionAssetsId: string;
  tagName: string;
}

interface UserInfo {
  UserName: string;
  CitizenIdentification: string;
  id: string;
}

const InputAuctionPrice = ({ auctionId }: props) => {
  // State cho danh sách dữ liệu
  const [auctionList, setAuctionList] = useState<InputAuctionPriceModals[]>([]);
  // State cho options của AutoComplete
  const [citizenOptions, setCitizenOptions] = useState<{ value: string }[]>([]);
  // State cho auction assets từ API
  const [auctionAssets, setAuctionAssets] = useState<AuctionAsset[]>([]);
  // State cho thông báo lỗi
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // State cho thông tin người dùng
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // Form instance từ antd
  const [form] = Form.useForm();

  // Xử lý submit form
  const onFinish = (values: InputAuctionPriceModals) => {
    const formattedValues = {
      ...values,
      price: parseFloat(values.price as unknown as string),
      auctionAssetName: auctionAssets.find(asset => asset.auctionAssetsId === values.auctionAssetId)?.tagName || "-",
      userName: userInfo?.UserName || "-",
      id: userInfo?.id || "-",
    };

    // Kiểm tra trùng lặp
    const isDuplicate = auctionList.some(
      item =>
        item.citizenIdentification === formattedValues.citizenIdentification &&
        item.id === formattedValues.id &&
        item.auctionAssetId === formattedValues.auctionAssetId
    );

    if (isDuplicate) {
      setErrorMessage("Người đấu giá tài sản này đã được bạn nhập giá đấu trước đây");
      return;
    }

    // Thêm dữ liệu vào danh sách
    setAuctionList([...auctionList, formattedValues]);

    // Reset form và các state liên quan
    form.resetFields();
    setAuctionAssets([]);
    setUserInfo(null);
    setErrorMessage(null);
    setCitizenOptions([]);
  };

  // Xử lý khi click nút Hoàn thành
  const handleComplete = () => {
    console.log("Danh sách giá đấu giá:", auctionList);
  };

  // Xử lý xóa hàng
  const handleDelete = (index: number) => {
    setAuctionList(auctionList.filter((_, i) => i !== index));
  };

  // Gọi API để lấy thông tin người dùng
  const getUserRegistedAuctionByCitizenIdentification = async (citizenIdentification: string) => {
    try {
      const response = await AuctionServices.userRegistedAuction({ citizenIdentification, auctionId });
      if (
        response.data &&
        response.data.auctionAssets &&
        response.data.auctionAssets.length > 0 &&
        response.data.name
      ) {
        setAuctionAssets(response.data.auctionAssets);
        setUserInfo({
          UserName: response.data.name,
          CitizenIdentification: response.data.citizenIdentification,
          id: response.data.id,
        });
        setErrorMessage(null);
      } else {
        setAuctionAssets([]);
        setUserInfo(null);
        setErrorMessage("Không tìm thấy dữ liệu với số CCCD này");
      }
    } catch (error) {
      console.error("Error fetching user registration:", error);
      setAuctionAssets([]);
      setUserInfo(null);
      setErrorMessage("Không tìm thấy dữ liệu với số CCCD này");
    }
  };

  // Xử lý khi nhập citizenIdentification
  const handleCitizenInput = (value: string) => {
    if (value.length === 12) {
      getUserRegistedAuctionByCitizenIdentification(value);
      setCitizenOptions([{ value }]);
    } else {
      setAuctionAssets([]);
      setUserInfo(null);
      setErrorMessage(null);
      setCitizenOptions(value ? [{ value }] : []);
    }
  };

  // Cấu hình cột cho Table của antd
  const columns = [
    {
      title: "Số CCCD",
      dataIndex: "citizenIdentification",
      key: "citizenIdentification",
      render: (text: string) => text || "-",
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "userName",
      key: "userName",
      render: (text: string) => text || "-",
    },
    {
      title: "Tên Tài Sản",
      dataIndex: "auctionAssetName",
      key: "auctionAssetName",
      render: (text: string) => text || "-",
    },
    {
      title: "Giá Đặt",
      dataIndex: "price",
      key: "price",
      render: (text: number) => text.toLocaleString(),
    },
    {
      title: "Hành Động",
      key: "action",
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
            <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    name="citizenIdentification"
                    label="Số CCCD"
                    rules={[
                      { required: true, message: "Vui lòng nhập số CCCD" },
                      { len: 12, message: "Số CCCD phải có 12 ký tự" },
                    ]}
                    help={errorMessage}
                    validateStatus={errorMessage ? "error" : undefined}
                  >
                    <AutoComplete
                      options={citizenOptions}
                      onChange={handleCitizenInput}
                      placeholder="Nhập số CCCD"
                      className="rounded-md"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="auctionAssetId"
                    label="Tài Sản Đấu Giá"
                    rules={[{ required: true, message: "Vui lòng chọn tài sản đấu giá" }]}
                  >
                    <Select
                      placeholder="Chọn tài sản đấu giá"
                      className="rounded-md"
                      disabled={!auctionAssets.length}
                    >
                      {auctionAssets.map(asset => (
                        <Select.Option key={asset.auctionAssetsId} value={asset.auctionAssetsId}>
                          {asset.tagName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="price"
                    label="Giá Đặt"
                    rules={[
                      { required: true, message: "Vui lòng nhập giá đặt" },
                      {
                        validator: (_, value) =>
                          value && parseFloat(value) > 0
                            ? Promise.resolve()
                            : Promise.reject("Giá đặt phải là số dương"),
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Nhập giá đặt"
                      className="rounded-md"
                      min="0"
                      step="0.01"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 border-none"
                  >
                    Thêm
                  </Button>
                  <Button
                    type="default"
                    icon={<CheckOutlined />}
                    onClick={handleComplete}
                    className="flex items-center gap-2"
                  >
                    Hoàn thành nhập phiếu
                  </Button>
                </Space>
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
              rowKey={(_, index) => index?.toString() || ""}
              locale={{ emptyText: "Không có dữ liệu" }}
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