/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table, type TableProps, Button, Tooltip } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { AuctionDataList } from "../../../Staff/Modals";
import { STAFF_ROUTES } from "../../../../routers";
import UserNameOrId from "../../../../components/Common/UserNameOrId";

interface AuctionTableProps {
  auctionData?: AuctionDataList[];
  headerTable: React.ReactElement;
  onChange: (pagination: any, sorter: any) => void;
  total: number;
  loading: boolean;
  pageSize?: number;
  currentPage?: number;
  selectedAuctionType?: string;
}

interface UserState {
  roleName?: string;
}

interface RootState {
  auth: {
    user?: UserState;
  };
}

const AuctionTable: React.FC<AuctionTableProps> = ({
  auctionData,
  headerTable,
  onChange,
  total,
  loading,
  pageSize = 10,
  currentPage = 1,
  selectedAuctionType,
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
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
      `/${rolePath}/${STAFF_ROUTES.SUB.AUCTION_LIST_DRAFF}/${STAFF_ROUTES.SUB.AUCTION_DETAIL_DRAFF}`,
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

  const isApprovalDisabled = (record: AuctionDataList): boolean => {
    return !record.registerEndDate || !dayjs().isBefore(dayjs(record.registerEndDate));
  };
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
      render: (text: string) => <TruncatedText text={text} maxWidth={450} />,
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
    {
      title: "Hành động",
      key: "action",
      render: (_, record: AuctionDataList) => (
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => handleNavigateToDetail(record)}
          className="bg-green-500 hover:bg-green-600"
          disabled={isApprovalDisabled(record)}
        >
          {role === "MANAGER" ? "Duyệt thông tin" : "Xem chi tiết"}
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
        loading={loading}
        pagination={{
          total,
          pageSize,
          current: currentPage,
          className: "bg-white rounded-b-lg",
        }}
        onRow={(record) => ({
          onClick: () => handleNavigateToDetail(record),
        })}
        locale={{ emptyText: "Không có dữ liệu" }}
        className="w-full border border-white rounded-lg overflow-hidden"
        rowClassName="hover:bg-blue-50 transition-colors duration-200"
      />
    </div>
  );
};

export default AuctionTable;
