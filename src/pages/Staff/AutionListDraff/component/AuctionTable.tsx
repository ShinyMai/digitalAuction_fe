/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, type TableProps, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import type { AuctionDataList, AuctioneerOptionModal } from "../../Modals";
import { STAFF_ROUTES } from "../../../../routers";
import { useSelector } from "react-redux";

interface Props {
  auctionData?: AuctionDataList[];
  headerTable: React.JSX.Element;
  onChange: (pagination: any, sorter: any) => void;
  total: number;
  loading: boolean;
  pageSize?: number;
  currentPage?: number;
  listAuctioneers?: AuctioneerOptionModal[]
}

const AuctionTable = ({
  auctionData,
  headerTable,
  onChange,
  total,
  loading,
  pageSize,
  currentPage,
  listAuctioneers,
}: Props) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;

  const handleApprove = (record: AuctionDataList) => {
    console.log("Approve auction:", record);
    // Thêm logic gọi API để duyệt thông tin tại đây
    // Ví dụ: AuctionServices.approveAuction(record.auctionId)
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
      sorter: true,
      render: (text: string, record: AuctionDataList) => (
        <div
          onClick={() => {
            const rolePath = role?.toLowerCase();
            navigate(
              `/${rolePath}/${STAFF_ROUTES.SUB.AUCTION_DETAIL}`,
              {
                state: { key: record.auctionId },
                replace: true,
              }
            );
          }}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          {text}
        </div>
      ),
    },
    {
      title: "Ngày ĐK Mở",
      dataIndex: "registerOpenDate",
      key: "registerOpenDate",
      sorter: true,
      render: (text: string) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Ngày ĐK Kết Thúc",
      dataIndex: "registerEndDate",
      key: "registerEndDate",
      sorter: true,
      render: (text: string) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "auctionStartDate",
      key: "auctionStartDate",
      sorter: true,
      render: (text: string) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "auctionEndDate",
      key: "auctionEndDate",
      sorter: true,
      render: (text: string) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Người tạo",
      dataIndex: "createdByUserName",
      key: "createdByUserName",
      sorter: true,
      render: (text: string) => text || "-",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: AuctionDataList) => (
        <div className="w-full flex justify-center">
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record)}
            className="bg-green-500 hover:bg-green-600"
            disabled={!record.registerEndDate || !dayjs().isBefore(dayjs(record.registerEndDate))}
          >
            Duyệt thông tin
          </Button>
        </div>
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
        rowClassName="hover:bg-blue-50 transition-colors duration-200"
      />
    </div>
  );
};

export default AuctionTable;