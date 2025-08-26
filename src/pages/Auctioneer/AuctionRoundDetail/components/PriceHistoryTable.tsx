/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Card, Typography, Tag, Empty } from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  DollarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AuctionRoundPrice } from "../../Modals";
import type { AuctionRound } from "../modalsData";

const { Title } = Typography;

interface PriceHistoryTableProps {
  priceHistory: AuctionRoundPrice[];
  auctionRound?: AuctionRound;
}

const PriceHistoryTable = ({
  priceHistory,
  auctionRound,
}: PriceHistoryTableProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Helpers
  const toPosNumber = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  // Lấy startingPrice cho từng dòng: ưu tiên từ chính row.startingPrice,
  // fallback tìm trong auctionRound?.auctionAssets nếu có (so theo tagName / name / assetName).
  const getStartingPrice = (row: any): number | undefined => {
    const direct = Number(row?.startingPrice);
    if (Number.isFinite(direct)) return direct;

    const assets: any[] = (auctionRound as any)?.auctionAssets;
    if (Array.isArray(assets)) {
      const found =
        assets.find(
          (a) =>
            a?.tagName === row?.tagName ||
            a?.name === row?.tagName ||
            a?.assetName === row?.tagName
        ) || null;
      const sp = Number(found?.startingPrice);
      if (Number.isFinite(sp)) return sp;
    }
    return undefined;
  };

  // Gom validate vào đây để dùng cho cột "Tính hợp lệ"
  const computeValidity = (row: AuctionRoundPrice) => {
    const reasons: string[] = [];

    const stepMin = toPosNumber((auctionRound as any)?.priceMin);
    const stepMax = toPosNumber((auctionRound as any)?.priceMax);
    const totalMax = toPosNumber((auctionRound as any)?.totalPriceMax);
    const limitMax = Number.isFinite(totalMax as number)
      ? (totalMax as number)
      : Infinity;

    const price = Number(row.auctionPrice) || 0;
    const start = getStartingPrice(row);

    console.log(start);
    // 1) Không vượt quá trần
    if (price > limitMax) {
      reasons.push(`Vượt giá tối đa ${formatPrice(limitMax)}`);
    }

    // Nếu không có startingPrice -> chỉ check trần, không có bước giá
    if (start === undefined) {
      return { valid: reasons.length === 0, reasons };
    }

    // 2) Cho phép bằng giá khởi điểm
    if (price === start) {
      return { valid: reasons.length === 0, reasons };
    }

    // 3) < giá khởi điểm
    if (price < start) {
      reasons.push("Nhỏ hơn giá khởi điểm");
      return { valid: false, reasons };
    }

    // 4) Kiểm tra bước giá OR (priceMin hoặc priceMax)
    const delta = price - start;

    // nếu không cấu hình bước nào → hợp lệ (chỉ cần không vượt trần)
    if (stepMin === undefined && stepMax === undefined) {
      return { valid: reasons.length === 0, reasons };
    }

    let divisibleOK = false;
    if (stepMin !== undefined && delta % stepMin === 0) divisibleOK = true;
    if (stepMax !== undefined && delta % stepMax === 0) divisibleOK = true;

    if (!divisibleOK) {
      const parts: string[] = [];
      if (stepMin !== undefined) parts.push(stepMin.toLocaleString("vi-VN"));
      if (stepMax !== undefined) parts.push(stepMax.toLocaleString("vi-VN"));
      reasons.push(
        `Sai bước giá (không chia hết cho ${parts.join(" hoặc ")} VND)`
      );
    }

    return { valid: reasons.length === 0, reasons };
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

    // 🆕 Cột "Tính hợp lệ"
    {
      title: (
        <span className="flex items-center gap-2">
          <CheckCircleOutlined />
          Tính hợp lệ
        </span>
      ),
      key: "validity",
      render: (_: any, record: DataType) => {
        const { valid, reasons } = computeValidity(record);
        return (
          <div className="flex flex-col">
            <Tag
              color={valid ? "green" : "red"}
              className="!text-sm !py-1 !px-3 !font-medium"
            >
              {valid ? "Hợp lệ" : "Không hợp lệ"}
            </Tag>
            {!valid && reasons?.length ? (
              <ul className="text-xs text-gray-500 list-disc pl-4 mt-1">
                {reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      },
      filters: [
        { text: "Hợp lệ", value: "valid" },
        { text: "Không hợp lệ", value: "invalid" },
      ],
      onFilter: (value, record) => {
        const { valid } = computeValidity(record);
        return value === "valid" ? valid : !valid;
      },
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
