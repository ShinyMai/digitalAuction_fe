import { Table, Card, Typography, Tag, Empty } from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  DollarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AuctionRoundPrice } from "../../Modals";

const { Title } = Typography;

interface PriceHistoryTableProps {
  priceHistory: AuctionRoundPrice[];
}

const PriceHistoryTable = ({ priceHistory }: PriceHistoryTableProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  type DataType = AuctionRoundPrice & { key: number };

  const columns: ColumnsType<DataType> = [
    {
      title: (
        <span className="flex items-center gap-2">
          <DollarOutlined />
          Tên tài sản
        </span>
      ),
      dataIndex: "tagName",
      key: "tagName",
      render: (text: string) => (
        <Tag color="blue" className="!text-sm !py-1 !px-3">
          {text}
        </Tag>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Người đấu giá
        </span>
      ),
      dataIndex: "userName",
      key: "userName",
      render: (text: string) => (
        <span className="!font-medium !text-gray-900">{text}</span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <IdcardOutlined />
          CCCD
        </span>
      ),
      dataIndex: "citizenIdentification",
      key: "citizenIdentification",
      render: (text: string) => (
        <span className="!font-mono !text-gray-600">{text}</span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <DollarOutlined />
          Giá trả
        </span>
      ),
      dataIndex: "auctionPrice",
      key: "auctionPrice",
      render: (price: number) => (
        <span className="!font-bold !text-green-600 !text-lg">
          {formatPrice(price)}
        </span>
      ),
      sorter: (a: DataType, b: DataType) => a.auctionPrice - b.auctionPrice,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <TrophyOutlined />
          Trạng thái
        </span>
      ),
      dataIndex: "flagWinner",
      key: "flagWinner",
      render: (isWinner: boolean) =>
        isWinner ? (
          <Tag color="gold" className="!text-sm !py-1 !px-3 !font-medium">
            🏆 Thắng cuộc
          </Tag>
        ) : (
          <Tag color="default" className="!text-sm !py-1 !px-3">
            Tham gia
          </Tag>
        ),
      filters: [
        { text: "Thắng cuộc", value: true },
        { text: "Tham gia", value: false },
      ],
      onFilter: (value, record) => record.flagWinner === value,
    },
  ];

  return (
    <Card className="!shadow-md">
      <Title level={4} className="!mb-4 !flex !items-center !gap-2">
        <DollarOutlined className="!text-blue-500" />
        Lịch sử trả giá
      </Title>

      <Table<DataType>
        columns={columns}
        dataSource={priceHistory.map((item, index) => ({
          ...item,
          key: index,
        }))}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} lượt đấu giá`,
        }}
        locale={{
          emptyText: (
            <Empty
              description="Chưa có lượt đấu giá nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        size="middle"
        className="custom-table"
      />
    </Card>
  );
};

export default PriceHistoryTable;
