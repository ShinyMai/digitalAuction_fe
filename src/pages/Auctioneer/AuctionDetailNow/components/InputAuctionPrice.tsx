/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Form,
  Button,
  Table,
  Row,
  Col,
  Card,
  Typography,
  InputNumber,
  Select,
  Tabs,
  Spin,
  Tag,
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
  UserOutlined,
} from "@ant-design/icons";
import AuctionServices from "../../../../services/AuctionServices";
import type { AuctionRoundModals } from "../../Modals";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import useAuctionRoundAnalysis from "../../../../hooks/useAuctionRoundAnalysis";

const { Text } = Typography;

// Constants
const FORM_VALIDATION_RULES = {
  PAGINATION_SIZE: 4,
} as const;

// Interface definitions
export interface InputAuctionPriceModals {
  citizenIdentification?: string;
  userName?: string;
  auctionAssetId?: string;
  auctionAssetName?: string;
  tagName?: string; // từ API
  price: number;
  auctionPrice?: number; // từ API
  recentLocation?: string;
  id: string;
  createdBy?: string; // từ API
  numericalOrder?: number; // số thứ tự
  startingPrice?: number;
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

interface Props {
  auctionId?: string;
  roundData?: AuctionRoundModals;
  auctionRoundIdBefore?: string;
  onBackToList?: () => void;
}

const InputAuctionPrice = ({
  auctionId,
  roundData,
  onBackToList,
  auctionRoundIdBefore,
}: Props) => {
  const [auctionRoundPriceList, setAuctionRoundPriceList] = useState<
    InputAuctionPriceModals[]
  >([]);
  const [auctionRoundPriceListOther, setAuctionRoundPriceListOther] = useState<
    InputAuctionPriceModals[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [completingLoading, setCompletingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [auctionAssets, setAuctionAssets] = useState<AuctionAsset[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AuctionAsset | null>(null);
  const [form] = Form.useForm<InputAuctionPriceModals>();
  const { user } = useSelector((state: RootState) => state.auth);

  const statistics = useMemo(() => {
    const totalMine = auctionRoundPriceList.length;
    const totalOther = Array.isArray(auctionRoundPriceListOther)
      ? auctionRoundPriceListOther.length
      : 0;
    const totalAll = totalMine + totalOther;
    return { totalMine, totalOther, totalAll };
  }, [auctionRoundPriceList, auctionRoundPriceListOther]);

  const filteredData = useMemo(() => {
    const filterMine = auctionRoundPriceList;
    const filterOther = Array.isArray(auctionRoundPriceListOther)
      ? auctionRoundPriceListOther
      : [];
    return { filterMine, filterOther };
  }, [auctionRoundPriceList, auctionRoundPriceListOther]);

  const currentNumericalOrder = Form.useWatch("numericalOrder", form);

  const availableAssets = useMemo(() => {
    if (!userInfo) return auctionAssets;

    // Các tài sản mà chính người này đã có giá (từ server - người khác nhập)
    const userExistingBids = Array.isArray(auctionRoundPriceListOther)
      ? auctionRoundPriceListOther.filter(
        (bid) => bid.citizenIdentification === userInfo.CitizenIdentification
      )
      : [];

    const otherBiddenTagNames = new Set(
      userExistingBids.map((bid) => bid.tagName)
    );

    // Các tài sản mà chính bạn đã thêm vào "Phiếu của tôi" CHO SỐ THỨ TỰ HIỆN TẠI
    const myBiddenAssetIdsForCurrentNo = new Set(
      auctionRoundPriceList
        .filter((bid) => bid.numericalOrder === currentNumericalOrder)
        .map((bid) => bid.auctionAssetId) // ưu tiên so theo ID cho chắc
        .filter(Boolean) as string[]
    );

    // Lọc: loại (1) đã có trong "người khác" của chính user này, (2) đã có trong list cục bộ cho số TT hiện tại
    return auctionAssets.filter(
      (asset) =>
        !otherBiddenTagNames.has(asset.tagName) &&
        !myBiddenAssetIdsForCurrentNo.has(asset.auctionAssetsId)
    );
  }, [
    auctionAssets,
    auctionRoundPriceListOther,
    auctionRoundPriceList, // thêm dependency này
    userInfo,
    currentNumericalOrder, // và dependency này
  ]);

  const getListAuctionRoundPrice = useCallback(async () => {
    try {
      if (roundData?.auctionRoundId) {
        const response = await AuctionServices.getListAuctionRoundPrices(
          roundData.auctionRoundId
        );
        if (response.code === 200) {
          const dataArray = Array.isArray(response.data.items)
            ? response.data.items
            : [];
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

  useEffect(() => {
    getListAuctionRoundPrice();
  }, [getListAuctionRoundPrice]);

  const handleTabChange = async () => {
    try {
      await getListAuctionRoundPrice();
    } catch (error) {
      console.error("Error refreshing data on tab change:", error);
    }
  };

  const getHighestBidForAsset = useCallback(
    (assetId: string) => {
      const selectedAssetName = auctionAssets.find(
        (asset) => asset.auctionAssetsId === assetId
      )?.tagName;
      if (!selectedAssetName) return null;

      const otherBidsForAsset = auctionRoundPriceListOther.filter(
        (bid) =>
          bid.tagName === selectedAssetName ||
          bid.auctionAssetName === selectedAssetName
      );
      const myBidsForAsset = auctionRoundPriceList.filter(
        (bid) => bid.auctionAssetName === selectedAssetName
      );

      const otherHighest =
        otherBidsForAsset.length > 0
          ? Math.max(
            ...otherBidsForAsset.map(
              (bid) => bid.auctionPrice || bid.price || 0
            )
          )
          : 0;
      const myHighest =
        myBidsForAsset.length > 0
          ? Math.max(...myBidsForAsset.map((bid) => bid.price || 0))
          : 0;
      const overallHighest = Math.max(otherHighest, myHighest);

      return {
        highest: overallHighest > 0 ? overallHighest : null,
        isMyBid: myHighest >= otherHighest && myHighest > 0,
        assetName: selectedAssetName,
      };
    },
    [auctionAssets, auctionRoundPriceListOther, auctionRoundPriceList]
  );

  const getUserRegistedAuctionByNumericalOrder = async (
    numericalOrder: number
  ) => {
    try {
      if (!auctionId) {
        toast.error("Không có thông tin đấu giá");
        return;
      }
      const response = await AuctionServices.userRegistedAuction({
        numericalOrder,
        auctionId: auctionId,
        auctionRoundId: auctionRoundIdBefore || null,
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
        setSelectedAsset(null);
        setErrorMessage("Không tìm thấy dữ liệu với số thứ tự này");
      }
    } catch (error) {
      console.error("Error fetching user registration:", error);
      setAuctionAssets([]);
      setUserInfo(null);
      setSelectedAsset(null);
      setErrorMessage("Không tìm thấy dữ liệu với số thứ tự này");
    }
  };

  const handleNumericalOrderInput = (value: number | null) => {
    if (value && value > 0) {
      void getUserRegistedAuctionByNumericalOrder(value);
    } else {
      setAuctionAssets([]);
      setUserInfo(null);
      form.resetFields();
      setSelectedAsset(null);
      setErrorMessage(null);
    }
  };

  const handleAssetSelect = (assetId: string) => {
    const asset =
      availableAssets.find((a) => a.auctionAssetsId === assetId) ||
      auctionAssets.find((a) => a.auctionAssetsId === assetId);
    setSelectedAsset(asset || null);
    form.setFieldsValue({ auctionAssetId: assetId } as any);
  };

  const onFinish = async (values: InputAuctionPriceModals) => {
    setLoading(true);
    try {
      const assetObj = auctionAssets.find(
        (a) => a.auctionAssetsId === values.auctionAssetId
      );
      const startingPrice =
        assetObj?.startingPrice ?? selectedAsset?.startingPrice ?? 0;

      const formattedValues: InputAuctionPriceModals = {
        ...values,
        price: values.price,
        userName: userInfo?.UserName || "-",
        citizenIdentification: userInfo?.CitizenIdentification || "-",
        auctionAssetName:
          assetObj?.tagName ||
          auctionAssets.find(
            (asset) => asset.auctionAssetsId === values.auctionAssetId
          )?.tagName ||
          "-",
        startingPrice: startingPrice || 0,
        id: uuidv4(),
      };
      const isDuplicate = auctionRoundPriceList.some(
        (item) =>
          item.numericalOrder === formattedValues.numericalOrder &&
          item.auctionAssetId === formattedValues.auctionAssetId
      );
      if (isDuplicate) {
        setErrorMessage(
          "Khách hàng đấu giá tài sản này đã được thêm vào danh sách trước đây!"
        );
        setLoading(false);
        return;
      }

      setAuctionRoundPriceList([...auctionRoundPriceList, formattedValues]);

      const updatedAssets = auctionAssets.filter(
        (asset) => asset.auctionAssetsId !== formattedValues.auctionAssetId
      );
      setAuctionAssets(updatedAssets);

      const currentNumericalOrder = values.numericalOrder;
      form.resetFields();
      form.setFieldsValue({ numericalOrder: currentNumericalOrder } as any);
      setSelectedAsset(null);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Đã xảy ra lỗi khi thêm giá đấu");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    const dataSubmit = {
      auctionRoundId: roundData?.auctionRoundId,
      resultDTOs: auctionRoundPriceList.map((item) => ({
        userName: item.userName || "-",
        citizenIdentification:
          item.citizenIdentification || userInfo?.CitizenIdentification || "-",
        recentLocation: item.recentLocation || "",
        tagName: item.auctionAssetName || "-",
        auctionPrice: item.price,
        createdBy: user?.id,
      })),
    };

    try {
      setCompletingLoading(true);
      const response = await AuctionServices.saveListAuctionRoundPrice(
        dataSubmit
      );
      if (response.code === 200) {
        toast.success(response.message || "Lưu danh sách giá đấu thành công");
        if (onBackToList) onBackToList();
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Lưu danh sách giá đấu thất bại");
    } finally {
      setCompletingLoading(false);
    }
  };

  const handleDelete = (index: number) => {
    const deletedItem = auctionRoundPriceList[index];

    setAuctionRoundPriceList(
      auctionRoundPriceList.filter((_, i) => i !== index)
    );

    if (deletedItem && userInfo && deletedItem.userName === userInfo.UserName) {
      const assetToRestore: AuctionAsset = {
        auctionAssetsId: deletedItem.auctionAssetId || "",
        tagName: deletedItem.auctionAssetName || "",
        startingPrice: deletedItem.startingPrice || 0,
      };

      const assetExists = auctionAssets.some(
        (asset) => asset.auctionAssetsId === assetToRestore.auctionAssetsId
      );
      if (!assetExists && assetToRestore.auctionAssetsId) {
        setAuctionAssets([...auctionAssets, assetToRestore]);
      }
    }
  };

  const { computeValidity } = useAuctionRoundAnalysis<
    InputAuctionPriceModals,
    AuctionAsset
  >({
    auctionRound: roundData,
    assets: auctionAssets, // để suy ra startingPrice theo tagName
    otherBids: auctionRoundPriceListOther, // để so "cao hơn người khác" khi là phiếu của tôi
  });

  const columns = [
    {
      title: "Số thứ tự",
      dataIndex: "numericalOrder",
      key: "numericalOrder",
      width: 150,
      render: (text: number) => (
        <div className="flex items-center gap-2 p-2">
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
      title: "CMND/CCCD",
      dataIndex: "citizenIdentification",
      key: "citizenIdentification",
      width: 180,
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <IdcardOutlined className="text-blue-500" />
          <Text className="font-medium">{text || "-"}</Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "validity",
      width: 160,
      render: (_: any, record: InputAuctionPriceModals) => {
        const { valid, reasons } = computeValidity(record, { isMine: true });
        return (
          <div className="flex flex-col">
            <Tag color={valid ? "green" : "red"}>
              {valid ? "Hợp lệ" : "Không hợp lệ"}
            </Tag>
            {!valid && reasons?.length ? (
              <div className="text-xs text-gray-500 list-disc mt-1">
                {reasons.map((r, i) => (
                  <div key={i}>{r}</div>
                ))}
              </div>
            ) : null}
          </div>
        );
      },
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

  const validationRules = useMemo(
    () => ({
      numericalOrder: [
        { required: true, message: "Vui lòng nhập số thứ tự" },
        {
          type: "number" as const,
          min: 1,
          message: "Số thứ tự phải lớn hơn 0",
        },
      ],
      auctionAssetId: [
        { required: true, message: "Vui lòng chọn tài sản đấu giá" },
      ],
      price: [{ required: true, message: "Vui lòng nhập giá đấu" }],
    }),
    []
  );

  const paginationConfig = useMemo(
    () =>
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
      render: (text: string) => (
        <Text className="font-medium text-gray-700">{text || "-"}</Text>
      ),
    },
    {
      title: "Giá đấu (VND)",
      dataIndex: "auctionPrice",
      key: "auctionPrice",
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
      title: "Trạng thái",
      key: "validity",
      width: 160,
      render: (_: any, record: InputAuctionPriceModals) => {
        const { valid, reasons } = computeValidity(record, { isMine: false });
        return (
          <div className="flex flex-col">
            <Tag color={valid ? "green" : "red"}>
              {valid ? "Hợp lệ" : "Không hợp lệ"}
            </Tag>
            {!valid && reasons?.length ? (
              <div className="text-xs text-gray-500 list-disc mt-1">
                {reasons.map((r, i) => (
                  <div key={i}>{r}</div>
                ))}
              </div>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <Spin spinning={loading || completingLoading} tip="Đang xử lý...">
      <div className="min-h-fit relative overflow-hidden">
        <div className="w-full mx-auto relative z-10 pt-4">
          {/* Back Button */}
          {onBackToList && (
            <div className="mb-6">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={onBackToList}
                className="!border-0 hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="large"
              >
                Quay lại danh sách
              </Button>
            </div>
          )}

          <Row gutter={[24, 24]} className="items-stretch">
            {/* Form bên trái */}
            <Col xs={24} lg={8}>
              <Card
                className="shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm border-0 transition-shadow duration-300 h-[700px] flex flex-col"
                title={
                  <div className="flex items-center gap-3 text-gray-800 border-b border-blue-100 p-3">
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
                    padding: "24px",
                    height: "calc(100% - 80px)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  },
                }}
              >
                <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="flex-1 flex flex-col h-full"
                  >
                    <div className="mb-4">
                      <Form.Item
                        name="numericalOrder"
                        label={
                          <span className="text-gray-700 font-semibold flex items-center gap-2 text-base">
                            <IdcardOutlined className="text-blue-500" />
                            Số thứ tự
                          </span>
                        }
                        rules={validationRules.numericalOrder}
                        help={errorMessage || undefined}
                        validateStatus={errorMessage ? "error" : undefined}
                      >
                        <InputNumber
                          placeholder="Nhập số thứ tự"
                          onChange={handleNumericalOrderInput}
                          className="w-full"
                          size="large"
                          min={1}
                          max={9999}
                          controls
                          precision={0}
                          style={{
                            width: "100%",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                          placeholder={
                            availableAssets.length === 0
                              ? userInfo
                                ? "Không có tài sản khả dụng - tất cả đã được đấu giá"
                                : "Vui lòng nhập số thứ tự trước"
                              : "Chọn tài sản đấu giá"
                          }
                          size="large"
                          disabled={!availableAssets.length}
                          onChange={handleAssetSelect}
                          style={{
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                          dropdownStyle={{
                            borderRadius: "12px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                          }}
                        >
                          {availableAssets.map((asset) => (
                            <Select.Option
                              key={asset.auctionAssetsId}
                              value={asset.auctionAssetsId}
                            >
                              <div className="flex items-center gap-2">
                                <HomeOutlined className="text-emerald-500" />
                                {asset.tagName}
                              </div>
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {userInfo &&
                        auctionAssets.length > availableAssets.length && (
                          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <div className="flex items-center gap-2 text-amber-700">
                              <span className="text-sm font-medium">
                                Một số tài sản không hiển thị vì{" "}
                                {userInfo.UserName} đã được nhập giá trước đó
                              </span>
                            </div>
                            <div className="text-xs text-amber-600 mt-1">
                              {auctionAssets.length - availableAssets.length}{" "}
                              tài sản đã được loại bỏ khỏi danh sách
                            </div>
                          </div>
                        )}

                      {selectedAsset && (
                        <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                              <DollarOutlined className="text-white text-sm" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-emerald-700">
                                Giá khởi điểm
                              </div>
                              <div className="text-lg font-bold text-emerald-800">
                                {selectedAsset.startingPrice?.toLocaleString(
                                  "vi-VN"
                                )}{" "}
                                VND
                              </div>
                            </div>
                          </div>
                          {(() => {
                            const pm = (roundData as any)?.priceMin;
                            const px = (roundData as any)?.priceMax;
                            const tpm = (roundData as any)?.totalPriceMax;

                            const showPM =
                              typeof pm === "number" &&
                              Number.isFinite(pm) &&
                              pm > 0;
                            const showPX =
                              typeof px === "number" &&
                              Number.isFinite(px) &&
                              px > 0;
                            const showTPM =
                              typeof tpm === "number" &&
                              Number.isFinite(tpm) &&
                              tpm > 0;

                            return (
                              <>
                                {showPM && (
                                  <div className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                                    <span>Bước giá tối thiểu</span>
                                    <span className="font-semibold">
                                      {pm.toLocaleString("vi-VN")} VND
                                    </span>
                                  </div>
                                )}

                                {showPX && (
                                  <div className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                                    <span>Bước giá tối đa</span>
                                    <span className="font-semibold">
                                      {px.toLocaleString("vi-VN")} VND
                                    </span>
                                  </div>
                                )}

                                {showTPM && (
                                  <div className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                                    <span>Giá tối đa</span>
                                    <span className="font-semibold">
                                      {tpm.toLocaleString("vi-VN")} VND
                                    </span>
                                  </div>
                                )}
                              </>
                            );
                          })()}

                          {(() => {
                            const bidInfo = getHighestBidForAsset(
                              selectedAsset.auctionAssetsId
                            );
                            if (bidInfo?.highest) {
                              return (
                                <div className="mt-3 pt-3 border-t border-emerald-200">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-6 h-6 bg-gradient-to-r ${bidInfo.isMyBid
                                        ? "from-blue-400 to-indigo-500"
                                        : "from-red-400 to-pink-500"
                                        } rounded-full flex items-center justify-center`}
                                    >
                                      <TrophyOutlined className="text-white text-xs" />
                                    </div>
                                    <div>
                                      <div
                                        className={`text-xs font-medium ${bidInfo.isMyBid
                                          ? "text-blue-700"
                                          : "text-red-700"
                                          }`}
                                      >
                                        Giá đấu cao nhất{" "}
                                        {bidInfo.isMyBid
                                          ? "(Của bạn)"
                                          : "(Của người khác)"}
                                      </div>
                                      <div
                                        className={`text-sm font-bold ${bidInfo.isMyBid
                                          ? "text-blue-800"
                                          : "text-red-800"
                                          }`}
                                      >
                                        {bidInfo.highest.toLocaleString(
                                          "vi-VN"
                                        )}{" "}
                                        VND
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}

                      <Form.Item
                        name="price"
                        label={
                          <span className="text-gray-700 font-semibold flex items-center gap-2 text-base mt-4">
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
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) =>
                            value ? value.replace(/\$\s?|(,*)/g, "") : ""
                          }
                        />
                      </Form.Item>
                    </div>

                    <div className="mt-auto flex flex-col gap-4">
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
                        loading={completingLoading}
                        disabled={completingLoading}
                        size="large"
                        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        {completingLoading
                          ? "Đang hoàn thành..."
                          : "Hoàn thành nhập phiếu"}
                      </Button>

                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 font-medium">
                            Phiếu đã nhập:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-600 text-lg">
                              {statistics.totalMine}
                            </span>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </Card>
            </Col>

            {/* Bảng bên phải */}
            <Col xs={24} lg={16}>
              <Card
                className="shadow-xl bg-gradient-to-br from-white to-indigo-50/30 backdrop-blur-sm border-0 transition-shadow duration-300 h-[700px] flex flex-col"
                title={
                  <div className="flex items-center gap-3 text-gray-800 border-b border-indigo-100 p-3">
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
                    padding: "24px",
                    height: "calc(100% - 80px)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  },
                }}
              >
                <div className="flex-1 overflow-hidden">
                  <Tabs
                    defaultActiveKey="1"
                    className="h-full flex flex-col p-0"
                    onChange={handleTabChange}
                    items={[
                      {
                        key: "1",
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
                                    <div className="text-gray-500 text-lg font-medium mb-2">
                                      Chưa có dữ liệu giá đấu
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                      Thêm giá đấu đầu tiên của bạn bằng form
                                      bên trái
                                    </div>
                                  </div>
                                ),
                              }}
                              pagination={paginationConfig}
                              className="!rounded-xl !overflow-hidden [&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-gradient-to-r [&_.ant-table-thead>tr>th]:!from-blue-50 [&_.ant-table-thead>tr>th]:!to-indigo-50 [&_.ant-table-thead>tr>th]:!border-blue-200"
                              rowClassName={(
                                record: InputAuctionPriceModals
                              ) => {
                                const { valid } = computeValidity(record, {
                                  isMine: true,
                                });
                                return `group transition-colors duration-200 ${valid ? "hover:bg-blue-50/50" : "bg-pink-50"
                                  }`;
                              }}
                              scroll={{ x: 800, y: 400 }}
                              size="middle"
                            />
                          </div>
                        ),
                      },
                      {
                        key: "2",
                        label: (
                          <span className="flex items-center gap-2 px-3 py-1">
                            <UserOutlined />
                            <span className="font-medium">
                              Phiếu của người khác
                            </span>
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
                              rowKey={(record, index) =>
                                record?.id || index?.toString() || ""
                              }
                              locale={{
                                emptyText: (
                                  <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                      <UserOutlined className="text-4xl text-emerald-400" />
                                    </div>
                                    <div className="text-gray-500 text-lg font-medium mb-2">
                                      Chưa có dữ liệu từ người khác
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                      Danh sách sẽ hiển thị khi có người khác
                                      nhập phiếu đấu giá
                                    </div>
                                  </div>
                                ),
                              }}
                              pagination={
                                statistics.totalOther >
                                  FORM_VALIDATION_RULES.PAGINATION_SIZE
                                  ? {
                                    pageSize:
                                      FORM_VALIDATION_RULES.PAGINATION_SIZE,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (
                                      total: number,
                                      range: [number, number]
                                    ) =>
                                      `${range[0]}-${range[1]} của ${total} mục`,
                                  }
                                  : false
                              }
                              className="!rounded-xl !overflow-hidden [&_.ant-table]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-gradient-to-r [&_.ant-table-thead>tr>th]:!from-emerald-50 [&_.ant-table-thead>tr>th]:!to-teal-50 [&_.ant-table-thead>tr>th]:!border-emerald-200"
                              rowClassName={(
                                record: InputAuctionPriceModals
                              ) => {
                                const { valid } = computeValidity(record, {
                                  isMine: false,
                                });
                                return `group transition-colors duration-200 ${valid ? "hover:bg-blue-50/50" : "bg-pink-50"
                                  }`;
                              }}
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

        .animate-float { animation: float 6s ease-in-out infinite; }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }

        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
          font-weight: 600 !important;
          color: #374151 !important;
          border-bottom: 2px solid #e5e7eb !important;
        }
        .ant-table-tbody > tr:hover > td { background: rgba(59, 130, 246, 0.05) !important; }
        .ant-card-head { border-bottom: 2px solid #e5e7eb !important; }
        .ant-input:focus, .ant-input-focused { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important; }
        .ant-input-number:focus, .ant-input-number-focused { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important; }

        .no-scrollbar {
        -ms-overflow-style: none;     /* IE, Edge cũ */
        scrollbar-width: none;        /* Firefox */
        -webkit-overflow-scrolling: touch; /* mượt trên iOS (tuỳ chọn) */
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;                /* Chrome, Safari, Opera */
        }
      `}</style>
      </div>
    </Spin>
  );
};

export default InputAuctionPrice;
