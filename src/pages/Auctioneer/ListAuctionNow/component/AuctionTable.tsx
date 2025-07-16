/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Tooltip, type TableProps } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import type { AuctionDataList } from "../../Modals";
import { AUCTIONEER_ROUTES, STAFF_ROUTES } from "../../../../routers";
import { useSelector } from "react-redux";
import UserNameOrId from "../../../../components/Common/UserNameOrId";

interface Props {
  auctionData?: AuctionDataList[];
  headerTable: React.JSX.Element;
  onChange: (pagination: any, sorter: any) => void;
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

  const columns: TableProps<AuctionDataList>["columns"] = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index: number) => calculateRowIndex(index),
    },
    {
      title: "Tên Đấu Giá",
      dataIndex: "auctionName",
      key: "auctionName",
      sorter: true,
      width: 250,
      render: (text: string) => <TruncatedText text={text} maxWidth={700} />,
    },
    {
      title: "Ngày Mở - Kết thúc ĐK",
      key: "registerDateRange",
      sorter: (a, b) => dayjs(a.registerOpenDate).unix() - dayjs(b.registerOpenDate).unix(),
      render: (_: any, record: AuctionDataList) => {
        const start = record.registerOpenDate ? formatDate(record.registerOpenDate) : "-";
        const end = record.registerEndDate ? formatDate(record.registerEndDate) : "-";
        return `${start} - ${end}`;
      },
    },
    {
      title: "Ngày Bắt Đầu - Kết Thúc",
      key: "auctionDateRange",
      sorter: (a, b) => dayjs(a.auctionStartDate).unix() - dayjs(b.auctionStartDate).unix(),
      render: (_: any, record: AuctionDataList) => {
        const start = record.auctionStartDate ? formatDate(record.auctionStartDate) : "-";
        const end = record.auctionEndDate ? formatDate(record.auctionEndDate) : "-";
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
        className="w-full border border-white rounded-lg overflow-hidden"
        onRow={(record) => ({
          onClick: () => {
            const rolePath = role?.toLowerCase();

            if (rolePath == STAFF_ROUTES.PATH) {
              navigate(
                `/${rolePath}/${STAFF_ROUTES.SUB.AUCTION_NOW}/${STAFF_ROUTES.SUB.AUCTION_DETAIL_NOW}`,
                {
                  state: { key: record.auctionId },
                  replace: true,
                }
              );
            } else if (rolePath == AUCTIONEER_ROUTES.PATH) {
              console.log("RolePath", rolePath);
              navigate(
                `/${rolePath}/${AUCTIONEER_ROUTES.SUB.AUCTION_NOW}/${AUCTIONEER_ROUTES.SUB.AUCTION_DETAIL_NOW}`,
                {
                  state: { key: record.auctionId },
                  replace: true,
                }
              );
            }
          },
        })}
        rowClassName="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
      />
    </div>
  );
};

export default AuctionTable;
