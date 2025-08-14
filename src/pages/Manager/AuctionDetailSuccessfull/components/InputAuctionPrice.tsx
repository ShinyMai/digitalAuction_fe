/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Form,
  Button,
  Table,
  Row,
  Col,
  Card,
  Typography,
  InputNumber,
  AutoComplete,
  Select,
  Space,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined,
  DollarOutlined,
  IdcardOutlined,
  HomeOutlined,
  TrophyOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import AuctionServices from "../../../../services/AuctionServices";
import type { AuctionRoundModals } from "../../Modals";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const { Title, Text } = Typography;

export interface InputAuctionPriceModals {
  citizenIdentification?: string;
  userName?: string;
  auctionAssetId?: string;
  auctionAssetName?: string;
  price: number;
  recentLocation?: string;
  id: string;
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

interface props {
  auctionId?: string;
  roundData?: AuctionRoundModals;
  auctionAssetsToStatistic?: AuctionAsset[];
  onBackToList?: () => void;
}

const InputAuctionPrice = ({
  auctionId,
  roundData,
  auctionAssetsToStatistic,
  onBackToList,
}: props) => {
  // State cho danh sách dữ liệu
  const [auctionRoundPriceList, setAuctionRoundPriceList] = useState<
    InputAuctionPriceModals[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [citizenOptions, setCitizenOptions] = useState<{ value: string }[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [auctionAssets, setAuctionAssets] = useState<AuctionAsset[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // Form instance từ antd
  const [form] = Form.useForm();
  const { user } = useSelector((state: RootState) => state.auth);
  // Gọi API để lấy thông tin người dùng
  const getUserRegistedAuctionByCitizenIdentification = async (
    citizenIdentification: string
  ) => {
    try {
      if (!auctionId) {
        toast.error("Không có thông tin đấu giá");
        return;
      }
      const response = await AuctionServices.userRegistedAuction({
        citizenIdentification,
        auctionId: auctionId,
      });
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
        setErrorMessage("Không tìm thấy dữ liệu với số CMND/CCCD này");
      }
    } catch (error) {
      console.error("Error fetching user registration:", error);
      setAuctionAssets([]);
      setUserInfo(null);
      setErrorMessage("Không tìm thấy dữ liệu với số CMND/CCCD này");
    }
  };

  // Xử lý khi nhập citizenIdentification
  const handleCitizenInput = (value: string) => {
    if (value.length >= 12) {
      getUserRegistedAuctionByCitizenIdentification(value);
      setCitizenOptions([{ value }]);
    } else {
      setAuctionAssets([]);
      setUserInfo(null);
      setErrorMessage(null);
      setCitizenOptions(value ? [{ value }] : []);
    }
  };

  // Xử lý submit form
  const onFinish = async (values: InputAuctionPriceModals) => {
    setLoading(true);
    try {
      // Chuyển price thành number và thêm id ngẫu nhiên
      const formattedValues = {
        ...values,
        price: values.price,
        userName: userInfo?.UserName || "-",
        auctionAssetName:
          auctionAssets.find(
            (asset) => asset.auctionAssetsId === values.auctionAssetId
          )?.tagName || "-",
        id: uuidv4(),
      };

      // Kiểm tra trùng lặp
      const isDuplicate = auctionRoundPriceList.some(
        (item) =>
          item.citizenIdentification ===
          formattedValues.citizenIdentification &&
          item.auctionAssetId === formattedValues.auctionAssetId
      );

      if (isDuplicate) {
        setErrorMessage(
          "Khách hàng đấu giá tài sản này đã được thêm vào danh sách trước đây!"
        );
        setLoading(false);
        return;
      }

      // Thêm dữ liệu vào danh sách
      setAuctionRoundPriceList([...auctionRoundPriceList, formattedValues]);

      // Reset form và các state liên quan
      form.resetFields();
      setAuctionAssets([]);
      setUserInfo(null);
      setErrorMessage(null);
      setCitizenOptions([]);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Đã xảy ra lỗi khi thêm giá đấu");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi click nút Hoàn thành
  const handleComplete = async () => {
    const dataSubmit = {
      auctionRoundId: roundData?.auctionRoundId,
      resultDTOs: auctionRoundPriceList.map((item) => ({
        userName: item.userName || "-",
        citizenIdentification: item.citizenIdentification,
        recentLocation: item.recentLocation || "",
        tagName: item.auctionAssetName || "-",
        auctionPrice: item.price,
        createdBy: user?.id,
      })),
    };
    try {
      const response = await AuctionServices.saveListAuctionRoundPrice(
        dataSubmit
      );
      if (response.code === 200) {
        toast.success(response.message || "Lưu danh sách giá đấu thành công");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Lưu danh sách giá đấu thất bại");
    }
  };

  // Xử lý xóa hàng
  const handleDelete = (index: number) => {
    setAuctionRoundPriceList(
      auctionRoundPriceList.filter((_, i) => i !== index)
    );
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
      title: "Tên Khách Hàng",
      dataIndex: "userName",
      key: "userName",
      width: 200,
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <Text className="font-medium">{text || "-"}</Text>
        </div>
      ),
    },
    {
      title: "Tên tài sản",
      dataIndex: "auctionAssetName",
      key: "auctionAssetName",
      width: 200,
      render: (text: string) => (
        <Text className="font-medium text-gray-700">{text || "-"}</Text>
      ),
    },
    {
      title: "Giá đấu (VND)",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (text: number) => (
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <Text className="font-bold text-green-600">
            {text?.toLocaleString("vi-VN")}
          </Text>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_: any, __: InputAuctionPriceModals, index: number) => (
        <div className="flex justify-center">
          <Button
            type="text"
            danger
            icon={
              <DeleteOutlined className="text-gray-400 hover:text-red-500 transition-colors duration-300" />
            }
            onClick={() => handleDelete(index)}
            className="hover:scale-110 transition-transform duration-200 !border-none"
            size="middle"
          />
        </div>
      ),
    },
  ];

  // Cấu hình phân trang
  const paginationConfig =
    auctionRoundPriceList.length > 8
      ? {
        pageSize: 8,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} của ${total} mục`,
      }
      : false;

  return (
    <div className="min-h-fit bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full animate-float delay-2000"></div>
      </div>

      <div className="w-full mx-auto relative z-10">
        {/* Back Button */}
        {onBackToList && (
          <div className="mb-6">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onBackToList}
              className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="large"
            >
              Quay lại danh sách
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mb-8">
          <Row gutter={[16, 16]}>
            {/* Tổng số phiếu */}
            <Col xs={24} sm={12} lg={6}>
              <Card
                className={`!bg-gradient-to-br !from-violet-500 !via-purple-500 !to-purple-600 !text-white !shadow-lg hover:!shadow-xl !transition-all !duration-300 !transform hover:!-translate-y-1 !rounded-lg !border-0 cursor-pointer ${!selectedAssetId ? "!ring-4 !ring-blue-400" : ""
                  }`}
                onClick={() => setSelectedAssetId(null)}
              >
                <div className="!flex !flex-col !items-center">
                  <Text className="!text-white/90 !text-lg !mb-2 !font-medium">
                    Tổng số phiếu
                  </Text>
                  <Title
                    level={2}
                    className="!text-white !mb-0 !drop-shadow-lg"
                  >
                    {auctionRoundPriceList.length}
                  </Title>
                </div>
              </Card>
            </Col>

            {/* Thống kê theo từng tài sản */}
            {auctionAssetsToStatistic?.map((asset, index) => {
              const assetCount = auctionRoundPriceList.filter(
                (item) => item.auctionAssetId === asset.auctionAssetsId
              ).length;

              // Mảng các gradient màu khác nhau
              const gradients = [
                "!bg-gradient-to-br !from-blue-500 !via-blue-600 !to-indigo-700",
                "!bg-gradient-to-br !from-emerald-400 !via-teal-500 !to-teal-600",
                "!bg-gradient-to-br !from-amber-400 !via-orange-500 !to-orange-600",
                "!bg-gradient-to-br !from-rose-400 !via-pink-500 !to-pink-600",
              ];

              return (
                <Col xs={24} sm={12} lg={6} key={asset.auctionAssetsId}>
                  <Card
                    className={`${gradients[index % gradients.length]
                      } !text-white !shadow-lg hover:!shadow-xl !transition-all !duration-300 !transform hover:!-translate-y-1 !rounded-lg !border-0 cursor-pointer ${selectedAssetId === asset.auctionAssetsId
                        ? "!ring-4 !ring-blue-400"
                        : ""
                      }`}
                    onClick={() => setSelectedAssetId(asset.auctionAssetsId)}
                  >
                    <div className="!flex !flex-col !items-center">
                      <Text
                        className="!text-white/90 !text-lg !mb-2 !truncate !font-medium"
                        title={asset.tagName}
                      >
                        {asset.tagName}
                      </Text>
                      <Title
                        level={2}
                        className="!text-white !mb-0 !drop-shadow-lg"
                      >
                        {assetCount}
                      </Title>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>

        <Row gutter={[24, 24]}>
          {/* Form nhập liệu bên trái */}
          <Col xs={24} lg={8}>
            <Card
              className="shadow-xl bg-white/90 backdrop-blur-sm border-0 transition-shadow duration-300"
              title={
                <div className="flex items-center gap-3 text-gray-800">
                  <span className="text-lg font-semibold">
                    Nhập Thông Tin Đấu Giá
                  </span>
                </div>
              }
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-4"
              >
                <Form.Item
                  name="citizenIdentification"
                  label={
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <IdcardOutlined className="text-blue-500" />
                      Số CMND/CCCD
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập số CMND/CCCD" },
                    { len: 12, message: "Số CMND/CCND phải có 12 ký tự" },
                  ]}
                  help={errorMessage}
                  validateStatus={errorMessage ? "error" : undefined}
                >
                  <AutoComplete
                    options={citizenOptions}
                    onChange={handleCitizenInput}
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
                      Tài Sản Đấu Giá
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn tài sản đấu giá",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn tài sản đấu giá"
                    className="rounded-lg h-12"
                    disabled={!auctionAssets.length}
                  >
                    {auctionAssets.map((asset) => (
                      <Select.Option
                        key={asset.auctionAssetsId}
                        value={asset.auctionAssetsId}
                      >
                        {asset.tagName}
                      </Select.Option>
                    ))}
                  </Select>
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
                    {
                      type: "number",
                      min: 1000,
                      message: "Giá đấu phải lớn hơn 1,000 VND",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập giá đấu"
                    className="w-full rounded-lg h-12 border-gray-300 hover:border-blue-500 focus:border-blue-500"
                    min={1000}
                    step={1000}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      icon={<PlusOutlined />}
                    >
                      {loading ? "Đang thêm..." : "Thêm Giá Đấu"}
                    </Button>
                    <Button
                      type="primary"
                      icon={
                        <div className="text-red-600">
                          <CheckOutlined />
                        </div>
                      }
                      onClick={handleComplete}
                      className="h-12 rounded-lg font-semibold"
                    >
                      Hoàn thành nhập phiếu
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Bảng dữ liệu bên phải */}
          <Col xs={24} lg={16}>
            <Card
              className="shadow-xl bg-white/90 backdrop-blur-sm border-0 transition-shadow duration-300 min-h-[450px]"
              title={
                <div className="flex items-center gap-3 text-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                    <TrophyOutlined className="text-white" />
                  </div>
                  <span className="text-lg font-semibold">
                    Danh Sách Giá Đấu
                  </span>
                </div>
              }
            >
              <Table
                dataSource={
                  selectedAssetId
                    ? auctionRoundPriceList.filter(
                      (item) => item.auctionAssetId === selectedAssetId
                    )
                    : auctionRoundPriceList
                }
                columns={columns}
                rowKey={(_, index) => index?.toString() || ""}
                locale={{
                  emptyText: (
                    <div className="text-center py-12">
                      <TrophyOutlined className="text-6xl text-gray-300 mb-4" />
                      <Text className="text-gray-500 text-lg">
                        Chưa có dữ liệu giá đấu
                      </Text>
                      <br />
                      <Text className="text-gray-400">
                        Thêm giá đấu đầu tiên của bạn
                      </Text>
                    </div>
                  ),
                }}
                pagination={paginationConfig}
                className="!rounded-lg !overflow-hidden"
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
          border-bottom: 2px solid # —e5e7eb !important;
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
