/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Tooltip, Button, type TableProps } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import type { AuctionDataList } from "../../Modals";
import { STAFF_ROUTES } from "../../../../routers";
import { useSelector } from "react-redux";
import UserNameOrId from "../../../../components/Common/UserNameOrId";

interface Props {
  auctionData?: AuctionDataList[];
  headerTable: React.JSX.Element;
  onChange: (pagination: any, filters: any, sorter: any) => void;
  total: number;
  loading: boolean;
  pageSize?: number;
  currentPage?: number;
  selectedAuctionType?: string; // Thêm prop để biết loại đấu giá được chọn
}

const AuctionTable = ({
  auctionData,
  headerTable,
  onChange,
  total,
  loading,
  pageSize,
  currentPage,
  selectedAuctionType,
}: Props) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;

  const handleViewDetail = (record: AuctionDataList) => {
    const rolePath = role?.toLowerCase();
    const navigationKey = record.auctionId || record._id;
    const auctionType = record.auctionId ? "SQL" : "NODE";

    navigate(`/${rolePath}/${STAFF_ROUTES.SUB.AUCTION_LIST_REJECT}/${STAFF_ROUTES.SUB.AUCTION_DETAIL_REJECT}`, {
      state: {
        key: navigationKey,
        type: auctionType,
      },
      replace: true,
    });
  };

  const columns: TableProps<AuctionDataList>["columns"] = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) =>
        ((currentPage || 1) - 1) * (pageSize || 10) + index + 1,
    },
    {
      title: "Tên Đấu Giá",
      dataIndex: "auctionName",
      key: "auctionName",
      sorter: (a, b) => a.auctionName.localeCompare(b.auctionName),
      ellipsis: {
        showTitle: false,
      },
      render: (auctionName: string) => (
        <Tooltip placement="topLeft" title={auctionName}>
          <span>{auctionName}</span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày Mở - Kết thúc ĐK",
      key: "registerDateRange",
      sorter: (a, b) => dayjs(a.registerOpenDate).unix() - dayjs(b.registerOpenDate).unix(),
      render: (_: any, record: AuctionDataList) => {
        const start = record.registerOpenDate
          ? dayjs(record.registerOpenDate).format("DD/MM/YYYY")
          : "-";
        const end = record.registerEndDate
          ? dayjs(record.registerEndDate).format("DD/MM/YYYY")
          : "-";
        return `${start} - ${end}`;
      },
    },
    {
      title: "Ngày Bắt Đầu - Kết Thúc",
      key: "auctionDateRange",
      sorter: (a, b) => dayjs(a.auctionStartDate).unix() - dayjs(b.auctionStartDate).unix(),
      render: (_: any, record: AuctionDataList) => {
        const start = record.auctionStartDate
          ? dayjs(record.auctionStartDate).format("DD/MM/YYYY")
          : "-";
        const end = record.auctionEndDate ? dayjs(record.auctionEndDate).format("DD/MM/YYYY") : "-";
        return `${start} - ${end}`;
      },
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      sorter: (a, b) => {
        if (!a.createdBy) return -1;
        if (!b.createdBy) return 1;
        return (a.createdBy || '').localeCompare(b.createdBy || '');
      },
      render: (userId: string, record: AuctionDataList) => (
        <UserNameOrId
          userId={userId}
          userName={record.createdByUserName}
          showUserName={selectedAuctionType === "2"}
        />
      ),
    },
    {
      title: "Xem chi tiết",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: any, record: AuctionDataList) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetail(record);
          }}
          className="flex items-center justify-center"
          title="Xem chi tiết"
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 bg-white rounded-xl p-4 sm:p-6">
      <div className="w-full">{headerTable}</div>
      <Table<AuctionDataList>
        columns={columns}
        dataSource={auctionData}
        onChange={onChange}
        pagination={{
          total,
          pageSize,
          current: currentPage,
          className: "bg-white rounded-b-lg",
        }}
        loading={loading}
        locale={{ emptyText: "Không có dữ liệu" }}
        className="w-full border border-white rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default AuctionTable;
