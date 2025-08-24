/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Tooltip, type TableProps } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import type { AuctionDataList } from "../../Modals";
import { MANAGER_ROUTES } from "../../../../routers";
import { useSelector } from "react-redux";
import UserNameOrId from "../../../../components/Common/UserNameOrId";

interface Props {
  auctionData?: AuctionDataList[];
  headerTable: React.JSX.Element;
  onChange: (pagination: any, filters: any, sorter: any) => void;
  total: number;
  loading: boolean;
  pageSize: number;
  currentPage: number;
  selectedAuctionType?: string;
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
  const formatDate = (dateString: string): string => {
    return dateString ? dayjs(dateString).format("DD/MM/YYYY") : "-";
  };

  const calculateRowIndex = (index: number): number => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const TruncatedText: React.FC<{ text: string; maxWidth?: number }> = ({
    text,
    maxWidth = 200,
  }) => (
    <Tooltip title={text} placement="topLeft">
      <div
        className="truncate cursor-pointer"
        style={{
          maxWidth: `${maxWidth}px`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </Tooltip>
  );

  const getNavigationParams = (record: AuctionDataList) => {
    const navigationKey = record.auctionId || record._id;
    const auctionType = record.auctionId ? "SQL" : "NODE";
    return { navigationKey, auctionType };
  };

  const handleNavigateToDetail = (record: AuctionDataList) => {
    const rolePath = role?.toLowerCase();
    const { navigationKey, auctionType } = getNavigationParams(record);

    navigate(
      `/${rolePath}/${MANAGER_ROUTES.SUB.AUCTION_LIST_CANCEL}/${MANAGER_ROUTES.SUB.AUCTION_DETAIL_CANCEL}`,
      {
        state: {
          key: navigationKey,
          type: auctionType,
          status: record.status,
        },
        replace: true,
      }
    );
  };

  const columns: TableProps<AuctionDataList>["columns"] = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_, __, index: number) => calculateRowIndex(index),
    },
    {
      title: "Tên Đấu Giá",
      dataIndex: "auctionName",
      key: "auctionName",
      sorter: true,
      width: 250,
      render: (text: string) => <TruncatedText text={text} maxWidth={300} />,
    },
    {
      title: "Ngày Mở - Kết thúc ĐK",
      key: "registerDateRange",
      width: 250,
      sorter: (a, b) =>
        dayjs(a.registerOpenDate).unix() - dayjs(b.registerOpenDate).unix(),
      render: (_: any, record: AuctionDataList) => {
        const start = record.registerOpenDate
          ? formatDate(record.registerOpenDate)
          : "-";
        const end = record.registerEndDate
          ? formatDate(record.registerEndDate)
          : "-";
        return `${start} - ${end}`;
      },
    },
    {
      title: "Ngày Bắt Đầu - Kết Thúc",
      key: "auctionDateRange",
      width: 270,
      sorter: (a, b) =>
        dayjs(a.auctionStartDate).unix() - dayjs(b.auctionStartDate).unix(),
      render: (_: any, record: AuctionDataList) => {
        const start = record.auctionStartDate
          ? formatDate(record.auctionStartDate)
          : "-";
        const end = record.auctionEndDate
          ? formatDate(record.auctionEndDate)
          : "-";
        return `${start} - ${end}`;
      },
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      sorter: true,
      width: 180,
      render: (userId: string, record: AuctionDataList) => {
        const userName = record.createdByUserName || userId;
        return (
          <Tooltip title={userName} placement="topLeft">
            <div className="truncate max-w-[150px]">
              <UserNameOrId
                userId={userId}
                userName={record.createdByUserName}
                showUserName={selectedAuctionType === "2"}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Người hủy",
      dataIndex: "createdBy",
      key: "createdBy",
      sorter: true,
      width: 180,
      render: (userId: string, record: AuctionDataList) => {
        const userName = record.updateByUserName || userId;
        return (
          <Tooltip title={userName} placement="topLeft">
            <div className="truncate max-w-[150px]">
              <UserNameOrId
                userId={userId}
                userName={record.updateByUserName}
                showUserName={selectedAuctionType === "2"}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Lý do hủy",
      dataIndex: "cancelReason",
      key: "cancelReason",
      sorter: true,
      width: 250,
      render: (text: string) => <TruncatedText text={text} maxWidth={450} />,
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
          // showSizeChanger: true,
          // pageSizeOptions: ["10", "20", "50"],
          className: "bg-white rounded-b-lg",
        }}
        loading={loading}
        locale={{ emptyText: "Không có dữ liệu" }}
        scroll={{ x: "max-content" }}
        onRow={(record) => ({
          onClick: () => handleNavigateToDetail(record),
        })}
        rowClassName="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
      />
    </div>
  );
};

export default AuctionTable;
