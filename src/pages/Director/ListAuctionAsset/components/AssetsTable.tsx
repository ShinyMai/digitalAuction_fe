import { Table, Tag, Button, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  TagOutlined,
  DollarOutlined,
  WalletOutlined,
  SafetyOutlined,
  EyeOutlined,
  RiseOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";
import dayjs from "dayjs";
import type { AuctionAsset, AssetsTableProps } from "../types";
import { CATEGORY_OPTIONS } from "../types";

const AssetsTable: React.FC<AssetsTableProps> = ({
  assets,
  searchParams,
  onSort,
  onAssetClick,
}) => {
  const formatVND = (amount: number) => {
    return `${formatNumber(amount)} VND`;
  };

  const getPriceCategory = (price: number) => {
    if (price < 100000000)
      return { color: "green", level: "Thấp", icon: <DollarOutlined /> };
    if (price < 500000000)
      return { color: "orange", level: "Trung bình", icon: <RiseOutlined /> };
    return { color: "red", level: "Cao", icon: <TrophyOutlined /> };
  };

  const columns: ColumnsType<AuctionAsset> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => (
        <span className="font-medium text-gray-600">
          {(searchParams.PageNumber - 1) * searchParams.PageSize + index + 1}
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <TagOutlined className="text-blue-500" />
          <span>Tên tài sản</span>
        </div>
      ),
      dataIndex: "tagName",
      key: "tagName",
      sorter: true,
      render: (text: string, record: AuctionAsset) => (
        <div className="space-y-1">
          <div
            className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
            onClick={() => onAssetClick(record)}
          >
            {text}
          </div>
          <div className="text-xs text-gray-500">
            ID: {record.auctionAssetsId.slice(-8)}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <span>Giá khởi điểm</span>
        </div>
      ),
      dataIndex: "startingPrice",
      key: "startingPrice",
      sorter: true,
      align: "right",
      render: (price: number) => {
        const priceCategory = getPriceCategory(price);
        return (
          <div className="text-right">
            <div className="font-bold text-green-600 mb-1">
              {formatVND(price)}
            </div>
            <Tag
              color={priceCategory.color}
              icon={priceCategory.icon}
              className="text-xs"
            >
              {priceCategory.level}
            </Tag>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <WalletOutlined className="text-blue-500" />
          <span>Tiền đặt trước</span>
        </div>
      ),
      dataIndex: "deposit",
      key: "deposit",
      sorter: true,
      align: "right",
      render: (deposit: number) => (
        <div className="font-semibold text-blue-600">{formatVND(deposit)}</div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <SafetyOutlined className="text-purple-500" />
          <span>Phí đăng ký</span>
        </div>
      ),
      dataIndex: "registrationFee",
      key: "registrationFee",
      sorter: true,
      align: "right",
      render: (fee: number) => (
        <div className="font-semibold text-purple-600">{formatVND(fee)}</div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      filters: CATEGORY_OPTIONS.map((category) => ({
        text: category.name,
        value: category.name,
      })),
      render: (category: string) => (
        <Tag color="blue" className="font-medium">
          {category}
        </Tag>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      width: 80,
      render: (unit: string) => (
        <Tag color="cyan" className="text-xs">
          {unit}
        </Tag>
      ),
    },
    {
      title: "Buổi đấu giá",
      dataIndex: "auctionName",
      key: "auctionName",
      render: (auctionName: string) => (
        <Tooltip title={auctionName}>
          <div className="max-w-[200px] truncate text-gray-700">
            {auctionName}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      width: 120,
      render: (date: string) => (
        <div className="text-sm text-gray-600">
          {dayjs(date).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_, record: AuctionAsset) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onAssetClick(record)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={assets}
      rowKey="auctionAssetsId"
      pagination={false}
      scroll={{ x: 1200 }}
      onChange={(_, __, sorter) => {
        if (sorter && !Array.isArray(sorter) && sorter.order) {
          onSort(sorter.field as string, sorter.order === "ascend");
        }
      }}
      rowClassName="hover:bg-blue-50 transition-colors"
    />
  );
};

export default AssetsTable;
