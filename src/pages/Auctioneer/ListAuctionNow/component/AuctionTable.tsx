/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, type TableProps } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import type { AuctionDataList } from "../../Modals";
import { AUCTIONEER_ROUTES, STAFF_ROUTES } from "../../../../routers";
import { useSelector } from "react-redux";

interface Props {
  auctionData?: AuctionDataList[];
  headerTable: React.JSX.Element;
  onChange: (pagination: any, sorter: any) => void;
  total: number;
  loading: boolean;
  pageSize?: number;
  currentPage?: number;
}

const AuctionTable = ({
  auctionData,
  headerTable,
  onChange,
  total,
  loading,
  pageSize,
  currentPage,
}: Props) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;
  const columns: TableProps<AuctionDataList>["columns"] = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) =>
        ((currentPage || 1) - 1) * (pageSize || 10) +
        index +
        1,
    },
    {
      title: "Tên Đấu Giá",
      dataIndex: "auctionName",
      key: "auctionName",
      sorter: true,
    },
    {
      title: "Ngày ĐK Mở",
      dataIndex: "registerOpenDate",
      key: "registerOpenDate",
      sorter: true,
      render: (text: string) =>
        text ? dayjs(text).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Ngày ĐK Kết Thúc",
      dataIndex: "registerEndDate",
      key: "registerEndDate",
      sorter: true,
      render: (text: string) =>
        text ? dayjs(text).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "auctionStartDate",
      key: "auctionStartDate",
      sorter: true,
      render: (text: string) =>
        text ? dayjs(text).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "auctionEndDate",
      key: "auctionEndDate",
      sorter: true,
      render: (text: string) =>
        text ? dayjs(text).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Người tạo",
      dataIndex: "createdByUserName",
      key: "createdByUserName",
      sorter: true,
      render: (text: string) => text || "-",
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
            } else if (rolePath == AUCTIONEER_ROUTES.SUB) {
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
