/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, type TableProps } from "antd";
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
  const currentDate = dayjs();

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
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
      render: (userId: string, record: AuctionDataList) => (
        <UserNameOrId
          userId={userId}
          userName={record.createdByUserName}
          showUserName={selectedAuctionType === "2"}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: AuctionDataList) => {
        const regEndDate = record.registerEndDate ? dayjs(record.registerEndDate) : null;
        const aucStartDate = record.auctionStartDate ? dayjs(record.auctionStartDate) : null;
        const aucEndDate = record.auctionEndDate ? dayjs(record.auctionEndDate) : null;

        let statusText = "-";
        let statusClass = "bg-gray-100 text-gray-800";

        if (regEndDate && currentDate.isBefore(regEndDate)) {
          statusText = "Đang thu hồ sơ";
          statusClass = "bg-green-100 text-green-800";
        } else if (
          regEndDate &&
          aucStartDate &&
          currentDate.isAfter(regEndDate) &&
          currentDate.isBefore(aucStartDate)
        ) {
          statusText = "Đang chuẩn bị tổ chức";
          statusClass = "bg-yellow-100 text-yellow-800";
        } else if (
          aucStartDate &&
          aucEndDate &&
          currentDate.isAfter(aucStartDate) &&
          currentDate.isBefore(aucEndDate)
        ) {
          statusText = "Đang diễn ra";
          statusClass = "bg-teal-100 text-teal-800";
        } else if (aucEndDate && currentDate.isAfter(aucEndDate)) {
          statusText = "Đã kết thúc";
          statusClass = "bg-red-100 text-red-800";
        }

        return (
          <span className={`inline-block px-2 py-1 rounded ${statusClass}`}>{statusText}</span>
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
          className: "bg-white rounded-b-lg",
        }}
        loading={loading}
        locale={{ emptyText: "Không có dữ liệu" }}
        className="w-full border border-white rounded-lg overflow-hidden"
        onRow={(record) => ({
          onClick: () => {
            const rolePath = role?.toLowerCase();
            const navigationKey = record.auctionId || record._id;
            const auctionType = record.auctionId ? "SQL" : "NODE";

            navigate(`/${rolePath}/${STAFF_ROUTES.SUB.AUCTION_DETAIL}`, {
              state: {
                key: navigationKey,
                type: auctionType,
              },
              replace: true,
            });
          },
        })}
        rowClassName="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
      />
    </div>
  );
};

export default AuctionTable;
