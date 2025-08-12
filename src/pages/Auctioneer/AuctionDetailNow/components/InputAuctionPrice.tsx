/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import { Form, Button, Table, Row, Col, Card, Typography, InputNumber, AutoComplete, Select, Tabs } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined,
  DollarOutlined,
  IdcardOutlined,
  HomeOutlined,
  TrophyOutlined,
  ArrowLeftOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AuctionServices from "../../../../services/AuctionServices";
import type { AuctionRoundModals } from "../../Modals";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

// Constants
const FORM_VALIDATION_RULES = {
  CITIZEN_ID_LENGTH: 12,
  PAGINATION_SIZE: 4,
} as const;

const GRADIENT_STYLES = [
  "!bg-gradient-to-br !from-blue-500 !via-blue-600 !to-indigo-700",
  "!bg-gradient-to-br !from-emerald-400 !via-teal-500 !to-teal-600",
  "!bg-gradient-to-br !from-amber-400 !via-orange-500 !to-orange-600",
  "!bg-gradient-to-br !from-rose-400 !via-pink-500 !to-pink-600"
] as const;

// Interface definitions

export interface InputAuctionPriceModals {
  citizenIdentification?: string;
  userName?: string;
  auctionAssetId?: string;
  auctionAssetName?: string;
  tagName?: string; // Thêm field này cho dữ liệu từ API
  price: number;
  auctionPrice?: number; // Thêm field này cho dữ liệu từ API
  recentLocation?: string;
  id: string;
  createdBy?: string; // Thêm field này cho dữ liệu từ API
}

interface AuctionAsset {
  auctionAssetsId: string;
  tagName: string;
  startingPrice?: number;
}

interface UserInfo {
  UserName: string;
  CitizenIdentification: string;
  id: string;
}

interface props {
  auctionId?: string;
  roundData?: AuctionRoundModals;
  auctionRoundIdBefore?: string;
  auctionAssetsToStatistic?: AuctionAsset[];
  onBackToList?: () => void;
}

const InputAuctionPrice = ({ auctionId, roundData, auctionAssetsToStatistic, onBackToList, auctionRoundIdBefore }: props) => {
  // State cho danh sách dữ liệu
  const [auctionRoundPriceList, setAuctionRoundPriceList] = useState<InputAuctionPriceModals[]>([]);
  const [auctionRoundPriceListOther, setAuctionRoundPriceListOther] = useState<InputAuctionPriceModals[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [citizenOptions, setCitizenOptions] = useState<{ value: string }[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [auctionAssets, setAuctionAssets] = useState<AuctionAsset[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AuctionAsset | null>(null);
  console.log("Auction Round ID Before:", auctionRoundIdBefore);
  // Form instance từ antd
  const [form] = Form.useForm();
  const { user } = useSelector((state: RootState) => state.auth);

  // Memoized calculations for performance
  const statistics = useMemo(() => {
    const totalMine = auctionRoundPriceList.length;
    const totalOther = Array.isArray(auctionRoundPriceListOther) ? auctionRoundPriceListOther.length : 0;
    const totalAll = totalMine + totalOther;

    const assetStats = auctionAssetsToStatistic?.map((asset, index) => {
      const assetCountMine = auctionRoundPriceList.filter(
        (item) => item.auctionAssetId === asset.auctionAssetsId
      ).length;

      const assetCountOther = Array.isArray(auctionRoundPriceListOther)
        ? auctionRoundPriceListOther.filter((item) => item.tagName === asset.tagName).length
        : 0;

      return {
        ...asset,
        assetCountMine,
        assetCountOther,
        totalAssetCount: assetCountMine + assetCountOther,
        gradientStyle: GRADIENT_STYLES[index % GRADIENT_STYLES.length]
      };
    }) || [];

    return {
      totalMine,
      totalOther,
      totalAll,
      assetStats
    };
  }, [auctionRoundPriceList, auctionRoundPriceListOther, auctionAssetsToStatistic]);

  // Memoized filtered data for tabs
  const filteredData = useMemo(() => {
    const filterMine = selectedAssetId
      ? auctionRoundPriceList.filter(item => item.auctionAssetId === selectedAssetId)
      : auctionRoundPriceList;

    const filterOther = selectedAssetId && Array.isArray(auctionRoundPriceListOther)
      ? auctionRoundPriceListOther.filter(item => {
        const selectedAsset = auctionAssetsToStatistic?.find(asset => asset.auctionAssetsId === selectedAssetId);
        return selectedAsset && item.tagName === selectedAsset.tagName;
      })
      : (Array.isArray(auctionRoundPriceListOther) ? auctionRoundPriceListOther : []);

    return { filterMine, filterOther };
  }, [selectedAssetId, auctionRoundPriceList, auctionRoundPriceListOther, auctionAssetsToStatistic]);

  // API để lấy danh sách giá đấu từ những người khác
  const getListAuctionRoundPrice = useCallback(async () => {
    try {
      if (roundData?.auctionRoundId) {
        const response = await AuctionServices.getListAuctionRoundPrices(roundData?.auctionRoundId);
        if (response.code === 200) {
          // Đảm bảo response.data là array
          const dataArray = Array.isArray(response.data.listAuctionRoundPrices) ? response.data.listAuctionRoundPrices : [];
          setAuctionRoundPriceListOther(dataArray);
        } else {
          setAuctionRoundPriceListOther([]);
        }
      }
    } catch (error) {
      console.error(error);
      setAuctionRoundPriceListOther([]);
    }
  }, [roundData?.auctionRoundId]);

  // Gọi API khi component mount
  useEffect(() => {
    getListAuctionRoundPrice();
  }, [getListAuctionRoundPrice]);

  // Gọi API để lấy thông tin người dùng
  const getUserRegistedAuctionByCitizenIdentification = async (citizenIdentification: string) => {
    try {
      if (!auctionId) {
        toast.error("Không có thông tin đấu giá");
        return;
      }
      const response = await AuctionServices.userRegistedAuction({ citizenIdentification, auctionId: auctionId, auctionRoundId: auctionRoundIdBefore || null });
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
        setSelectedAsset(null);
        setErrorMessage("Không tìm thấy dữ liệu với số CMND/CCCD này");
      }
    } catch (error) {
      console.error("Error fetching user registration:", error);
      setAuctionAssets([]);
      setUserInfo(null);
      setSelectedAsset(null);
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
      setSelectedAsset(null);
      setErrorMessage(null);
      setCitizenOptions(value ? [{ value }] : []);
    }
  };

  // Xử lý khi chọn tài sản
  const handleAssetSelect = (assetId: string) => {
    const asset = auctionAssets.find(a => a.auctionAssetsId === assetId);
    setSelectedAsset(asset || null);
    form.setFieldsValue({ auctionAssetId: assetId });
  };

  // Xử lý submit form
  const onFinish = async (values: InputAuctionPriceModals) => {
    setLoading(true);
    try {
      // Kiểm tra giá đấu so với giá khởi điểm của tài sản được chọn
      if (selectedAsset?.startingPrice && values.price < selectedAsset.startingPrice) {
        setErrorMessage(`Giá đấu phải lớn hơn hoặc bằng giá khởi điểm ${selectedAsset.startingPrice.toLocaleString("vi-VN")} VND`);
        setLoading(false);
        return;
      }

      // Chuyển price thành number và thêm id ngẫu nhiên
      const formattedValues = {
        ...values,
        price: values.price,
        userName: userInfo?.UserName || "-",
        auctionAssetName: auctionAssets.find(asset => asset.auctionAssetsId === values.auctionAssetId)?.tagName || "-",
        id: crypto.randomUUID(),
      };

      // Kiểm tra trùng lặp
      const isDuplicate = auctionRoundPriceList.some(
        item =>
          item.citizenIdentification === formattedValues.citizenIdentification &&
          item.auctionAssetId === formattedValues.auctionAssetId
      );

      if (isDuplicate) {
        setErrorMessage("Người đấu giá tài sản này đã được bạn nhập giá đấu trước đây");
        setLoading(false);
        return;
      }

      // Thêm dữ liệu vào danh sách
      setAuctionRoundPriceList([...auctionRoundPriceList, formattedValues]);

      // Lưu lại số CMND/CCCD để giữ lại sau khi submit
      const currentCitizenId = values.citizenIdentification;

      // Reset form nhưng giữ lại số CMND/CCCD
      form.resetFields();
      form.setFieldsValue({
        citizenIdentification: currentCitizenId
      });

      // Reset selected asset khi submit thành công
      setSelectedAsset(null);

      // Không clear auctionAssets và userInfo để có thể tiếp tục chọn tài sản khác
      // setAuctionAssets([]);
      // setUserInfo(null);
      setErrorMessage(null);
      // Giữ lại citizenOptions với giá trị hiện tại
      setCitizenOptions(currentCitizenId ? [{ value: currentCitizenId }] : []);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Đã xảy ra lỗi khi thêm giá đấu");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi click nút Hoàn thành
  const handleComplete = async () => {
    console.log("Danh sách giá đấu giá:", auctionRoundPriceList);
    const dataSubmit = {
      auctionRoundId: roundData?.auctionRoundId,
      resultDTOs: auctionRoundPriceList.map(item => ({
        userName: item.userName || "-",
        citizenIdentification: item.citizenIdentification,
        recentLocation: item.recentLocation || "",
        tagName: item.auctionAssetName || "-",
        auctionPrice: item.price,
        createdBy: user?.id,
      })),
    };
    console.log("Dữ liệu gửi đi:", dataSubmit);
    try {
      const response = await AuctionServices.saveListAuctionRoundPrice(dataSubmit);
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
    setAuctionRoundPriceList(auctionRoundPriceList.filter((_, i) => i !== index));
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
        <div className="flex justify-center">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined className="text-gray-400 hover:text-red-500 transition-colors duration-300" />}
            onClick={() => handleDelete(index)}
            className="hover:scale-110 transition-transform duration-200 !border-none"
            size="middle"
          />
        </div>
      ),
    },
  ];

  // Memoized validation rules
  const validationRules = useMemo(() => ({
    citizenIdentification: [
      { required: true, message: "Vui lòng nhập số CMND/CCCD" },
      { len: FORM_VALIDATION_RULES.CITIZEN_ID_LENGTH, message: "Số CMND/CCND phải có 12 ký tự" },
    ],
    auctionAssetId: [
      { required: true, message: "Vui lòng chọn tài sản đấu giá" }
    ],
    price: [
      { required: true, message: "Vui lòng nhập giá đấu" },
    ]
  }), []);

  // Memoized pagination config
  const paginationConfig = useMemo(() =>
    statistics.totalMine > FORM_VALIDATION_RULES.PAGINATION_SIZE
      ? {
        pageSize: FORM_VALIDATION_RULES.PAGINATION_SIZE,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} của ${total} mục`,
      }
      : false,
    [statistics.totalMine]
  );
  const columnsOther = [
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
      dataIndex: "tagName",
      key: "tagName",
      width: 200,
      render: (text: string) => <Text className="font-medium text-gray-700">{text || "-"}</Text>,
    },
    {
      title: "Giá đấu (VND)",
      dataIndex: "auctionPrice",
      key: "auctionPrice",
      width: 150,
      render: (text: number) => (
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <Text className="font-bold text-green-600">{text?.toLocaleString("vi-VN")}</Text>
        </div>
      ),
    },
    {
      title: "Người nhập",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
      render: (text: string) => (
        <Text className="font-medium text-blue-600">{text || "Khác"}</Text>
      ),
    },
  ];

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
                className={`!bg-gradient-to-br !from-violet-500 !via-purple-500 !to-purple-600 !text-white !shadow-lg hover:!shadow-xl !transition-all !duration-300 !transform hover:!-translate-y-1 !rounded-lg !border-0 cursor-pointer ${!selectedAssetId ? '!ring-4 !ring-blue-400' : ''}`}
                onClick={() => setSelectedAssetId(null)}
              >
                <div className="!flex !flex-col !items-center">
                  <Text className="!text-white/90 !text-lg !mb-2 !font-medium">Tổng số phiếu</Text>
                  <Title level={2} className="!text-white !mb-0 !drop-shadow-lg">
                    {statistics.totalAll}
                  </Title>
                  <div className="!text-white/70 !text-sm">
                    Của tôi: {statistics.totalMine} | Khác: {statistics.totalOther}
                  </div>
                </div>
              </Card>
            </Col>

            {/* Thống kê theo từng tài sản */}
            {statistics.assetStats.map((assetStat) => (
              <Col xs={24} sm={12} lg={6} key={assetStat.auctionAssetsId}>
                <Card
                  className={`${assetStat.gradientStyle} !text-white !shadow-lg hover:!shadow-xl !transition-all !duration-300 !transform hover:!-translate-y-1 !rounded-lg !border-0 cursor-pointer ${selectedAssetId === assetStat.auctionAssetsId ? '!ring-4 !ring-blue-400' : ''}`}
                  onClick={() => setSelectedAssetId(assetStat.auctionAssetsId)}
                >
                  <div className="!flex !flex-col !items-center">
                    <Text className="!text-white/90 !text-lg !mb-2 !truncate !font-medium" title={assetStat.tagName}>
                      {assetStat.tagName}
                    </Text>
                    <Title level={2} className="!text-white !mb-0 !drop-shadow-lg">
                      {assetStat.totalAssetCount}
                    </Title>
                    <div className="!text-white/70 !text-xs">
                      Của tôi: {assetStat.assetCountMine} | Khác: {assetStat.assetCountOther}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Row gutter={[24, 24]} className="items-stretch">
          {/* Form nhập liệu bên trái */}
          <Col xs={24} lg={8}>
            <Card
              className="shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm border-0 transition-shadow duration-300 h-[700px] flex flex-col"
              title={
                <div className="flex items-center gap-3 text-gray-800 border-b border-blue-100 pb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <IdcardOutlined className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Nhập Thông Tin Đấu Giá
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Điền thông tin để thêm phiếu đấu giá mới
                    </div>
                  </div>
                </div>
              }
              styles={{
                body: {
                  padding: '24px',
                  height: 'calc(100% - 80px)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }
              }}
            >
              <div className="flex-1 flex flex-col h-full">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  className="flex-1 flex flex-col h-full"
                >
                  {/* Form fields - scrollable area */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-5" style={{ maxHeight: 'calc(100% - 160px)' }}>
                    <Form.Item
                      name="citizenIdentification"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2 text-base">
                          <IdcardOutlined className="text-blue-500" />
                          Số CMND/CCCD
                        </span>
                      }
                      rules={validationRules.citizenIdentification}
                      help={errorMessage}
                      validateStatus={errorMessage ? "error" : undefined}
                    >
                      <AutoComplete
                        options={citizenOptions}
                        onChange={handleCitizenInput}
                        placeholder="Nhập số CMND/CCCD (12 số)"
                        className="w-full"
                        size="large"
                        style={{
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="auctionAssetId"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2 text-base">
                          <HomeOutlined className="text-emerald-500" />
                          Tài Sản Đấu Giá
                        </span>
                      }
                      rules={validationRules.auctionAssetId}
                    >
                      <Select
                        placeholder="Chọn tài sản đấu giá"
                        size="large"
                        disabled={!auctionAssets.length}
                        onChange={handleAssetSelect}
                        style={{
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        dropdownStyle={{
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                        }}
                      >
                        {auctionAssets.map(asset => (
                          <Select.Option key={asset.auctionAssetsId} value={asset.auctionAssetsId}>
                            <div className="flex items-center gap-2">
                              <HomeOutlined className="text-emerald-500" />
                              {asset.tagName}
                            </div>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Hiển thị giá khởi điểm khi đã chọn tài sản */}
                    {selectedAsset && (
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                            <DollarOutlined className="text-white text-sm" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-emerald-700">Giá khởi điểm</div>
                            <div className="text-lg font-bold text-emerald-800">
                              {selectedAsset.startingPrice?.toLocaleString("vi-VN")} VND
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                          Giá đấu phải lớn hơn hoặc bằng giá khởi điểm
                        </div>
                      </div>
                    )}

                    <Form.Item
                      name="price"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2 text-base">
                          <DollarOutlined className="text-amber-500" />
                          Giá Đấu (VND)
                        </span>
                      }
                      rules={validationRules.price}
                    >
                      <InputNumber
                        placeholder="Nhập giá đấu"
                        size="large"
                        step={1000}
                        style={{
                          width: "100%",
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </div>

                  {/* Action buttons - fixed at bottom */}
                  <div className="mt-auto pt-6 border-t border-gray-100 space-y-3 flex-shrink-0">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      icon={<PlusOutlined />}
                    >
                      {loading ? "Đang thêm..." : "Thêm Giá Đấu"}
                    </Button>

                    <Button
                      type="default"
                      icon={<CheckOutlined />}
                      onClick={handleComplete}
                      size="large"
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Hoàn thành nhập phiếu
                    </Button>

                    {/* Status indicator */}
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">Phiếu đã nhập:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 text-lg">{statistics.totalMine}</span>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </Card>
          </Col>

          {/* Bảng dữ liệu bên phải */}
          <Col xs={24} lg={16}>
            <Card
              className="shadow-xl bg-gradient-to-br from-white to-indigo-50/30 backdrop-blur-sm border-0 transition-shadow duration-300 h-[700px] flex flex-col"
              title={
                <div className="flex items-center gap-3 text-gray-800 border-b border-indigo-100 pb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <TrophyOutlined className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Danh Sách Giá Đấu
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Quản lý và theo dõi các phiếu đấu giá
                    </div>
                  </div>
                </div>
              }
              styles={{
                body: {
                  padding: '24px',
                  height: 'calc(100% - 80px)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }
              }}
            >
              <div className="flex-1 overflow-hidden">
                <Tabs
                  defaultActiveKey="1"
                  className="h-full flex flex-col"
                  items={[
                    {
                      key: '1',
                      label: (
                        <span className="flex items-center gap-2 px-3 py-1">
                          <TrophyOutlined />
                          <span className="font-medium">Phiếu của tôi</span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                            {statistics.totalMine}
                          </span>
                        </span>
                      ),
                      children: (
                        <div className="h-[520px] overflow-hidden">
                          <Table
                            dataSource={filteredData.filterMine}
                            columns={columns}
                            rowKey={(_, index) => index?.toString() || ""}
                            locale={{
                              emptyText: (
                                <div className="text-center py-16">
                                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrophyOutlined className="text-4xl text-blue-400" />
                                  </div>
                                  <div className="text-gray-500 text-lg font-medium mb-2">Chưa có dữ liệu giá đấu</div>
                                  <div className="text-gray-400 text-sm">Thêm giá đấu đầu tiên của bạn bằng form bên trái</div>
                                </div>
                              ),
                            }}
                            pagination={paginationConfig}
                            className="!rounded-xl !overflow-hidden [&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-gradient-to-r [&_.ant-table-thead>tr>th]:!from-blue-50 [&_.ant-table-thead>tr>th]:!to-indigo-50 [&_.ant-table-thead>tr>th]:!border-blue-200"
                            rowClassName="group hover:bg-blue-50/50 transition-colors duration-200"
                            scroll={{ x: 800, y: 400 }}
                            size="middle"
                          />
                        </div>
                      ),
                    },
                    {
                      key: '2',
                      label: (
                        <span className="flex items-center gap-2 px-3 py-1">
                          <UserOutlined />
                          <span className="font-medium">Phiếu của người khác</span>
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">
                            {statistics.totalOther}
                          </span>
                        </span>
                      ),
                      children: (
                        <div className="h-[520px] overflow-hidden">
                          <Table
                            dataSource={filteredData.filterOther}
                            columns={columnsOther}
                            rowKey={(record, index) => record?.id || index?.toString() || ""}
                            locale={{
                              emptyText: (
                                <div className="text-center py-16">
                                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserOutlined className="text-4xl text-emerald-400" />
                                  </div>
                                  <div className="text-gray-500 text-lg font-medium mb-2">Chưa có dữ liệu từ người khác</div>
                                  <div className="text-gray-400 text-sm">Danh sách sẽ hiển thị khi có người khác nhập phiếu đấu giá</div>
                                </div>
                              ),
                            }}
                            pagination={
                              statistics.totalOther > FORM_VALIDATION_RULES.PAGINATION_SIZE
                                ? {
                                  pageSize: FORM_VALIDATION_RULES.PAGINATION_SIZE,
                                  showSizeChanger: true,
                                  showQuickJumper: true,
                                  showTotal: (total: number, range: [number, number]) =>
                                    `${range[0]}-${range[1]} của ${total} mục`,
                                }
                                : false
                            }
                            className="!rounded-xl !overflow-hidden [&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-gradient-to-r [&_.ant-table-thead>tr>th]:!from-emerald-50 [&_.ant-table-thead>tr>th]:!to-teal-50 [&_.ant-table-thead>tr>th]:!border-emerald-200"
                            rowClassName="group hover:bg-emerald-50/50 transition-colors duration-200"
                            scroll={{ x: 800, y: 400 }}
                            size="middle"
                          />
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
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