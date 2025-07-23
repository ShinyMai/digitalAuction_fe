/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Table, Card, Select, Tooltip, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import type { AuctionDataList, AuctionCategory } from "../../../Staff/Modals";

interface SearchParams {
  AuctionName?: string;
  CategoryId?: number;
  SortBy?: string;
  IsAscending?: boolean;
  PageNumber?: number;
  PageSize?: number;
  RegisterOpenDate?: string;
  RegisterEndDate?: string;
  AuctionStartDate?: string;
  AuctionEndDate?: string;
  Status: number;
}

const AuctionSearchList = ({
  searchParams,
  setSearchParams,
  auctionList,
  totalData,
  loading,
  onSelectAuction,
  listAuctionCategory,
}: {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  auctionList: AuctionDataList[];
  totalData: number;
  loading: boolean;
  onSelectAuction: (auctionId: string) => void;
  listAuctionCategory: AuctionCategory[];
}) => {
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 80,
      render: (_: any, __: any, index: number) =>
        (searchParams.PageNumber! - 1) * searchParams.PageSize! + index + 1,
    },
    {
      title: "Tên Đấu Giá",
      dataIndex: "auctionName",
      key: "auctionName",
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày ĐK Mở",
      dataIndex: "registerOpenDate",
      key: "registerOpenDate",
      width: 120,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text ? dayjs(text).format("DD/MM/YYYY") : "-"}>
          <span>{text ? dayjs(text).format("DD/MM/YYYY") : "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày ĐK Kết Thúc",
      dataIndex: "registerEndDate",
      key: "registerEndDate",
      width: 120,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text ? dayjs(text).format("DD/MM/YYYY") : "-"}>
          <span>{text ? dayjs(text).format("DD/MM/YYYY") : "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_: any, record: AuctionDataList) => (
        <Button
          type="primary"
          onClick={() => onSelectAuction(record.auctionId)} // Chuyển thẳng sang bước detail
          className="bg-blue-500 hover:bg-blue-600"
          disabled={!dayjs().isBefore(dayjs(record.registerEndDate))}
        >
          Đăng ký hộ
        </Button>
      ),
    },
  ];

  const handleSearch = (name: string, categoryId?: number) => {
    setSearchParams({
      ...searchParams,
      AuctionName: name,
      CategoryId: categoryId,
      PageNumber: 1,
    });
  };

  const handleTableChange = (pagination: any) => {
    setSearchParams({
      ...searchParams,
      PageNumber: pagination.current,
      PageSize: pagination.pageSize,
    });
  };

  return (
    <motion.div
      key="list"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="space-y-8">
        <Card className="shadow-sm bg-white/50 backdrop-blur-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-600">Tên buổi đấu giá</label>
              <Input
                placeholder="Nhập tên buổi đấu giá..."
                value={searchParams.AuctionName}
                onChange={(e) => handleSearch(e.target.value, searchParams.CategoryId)}
                size="large"
                className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500"
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-600">Danh mục tài sản</label>
              <Select
                placeholder="Chọn danh mục tài sản..."
                value={searchParams.CategoryId}
                onChange={(value) => handleSearch(searchParams.AuctionName || "", value)}
                size="large"
                className="w-full"
                style={{ height: "40px" }}
                allowClear
                options={listAuctionCategory.map((category) => ({
                  value: category.categoryId,
                  label: category.categoryName,
                }))}
                dropdownStyle={{ borderRadius: '8px' }}
                popupClassName="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={auctionList}
            loading={loading}
            onChange={handleTableChange}
            pagination={{
              total: totalData,
              pageSize: searchParams.PageSize!,
              current: searchParams.PageNumber!,
              showSizeChanger: true,
            }}
            rowKey="auctionId"
            locale={{ emptyText: "Không có dữ liệu" }}
            className="w-full rounded-lg overflow-hidden mt-7"
            rowClassName="hover:bg-blue-50 transition-colors duration-200"
          />
        </Card>
      </div>
    </motion.div>
  );
};

export default AuctionSearchList;
