/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Button, Table, Card, Select, Tooltip } from "antd";
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
                    onClick={() => onSelectAuction(record.auctionId)}
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
        >
            <div className="mb-6 flex gap-2 justify-end">
                <div className="w-60 rounded-md">
                    <Input
                        placeholder="Nhập tên buổi đấu giá"
                        value={searchParams.AuctionName}
                        onChange={(e) => handleSearch(e.target.value, searchParams.CategoryId)}
                        size="large"
                        suffix={<SearchOutlined />}
                    />
                </div>
                <Select
                    placeholder="Chọn danh mục"
                    value={searchParams.CategoryId}
                    onChange={(value) => handleSearch(searchParams.AuctionName || "", value)}
                    size="large"
                    className="w-40"
                    allowClear
                    options={listAuctionCategory.map((category) => ({
                        value: category.categoryId,
                        label: category.categoryName,
                    }))}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(searchParams.AuctionName || "", searchParams.CategoryId)}
                    loading={loading}
                    className="bg-blue-500 hover:bg-blue-600"
                    size="large"
                >
                    Tìm kiếm
                </Button>
            </div>
            <Card className="shadow-md rounded-lg">
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
                    className="w-full rounded-lg overflow-hidden"
                    rowClassName="hover:bg-blue-50 transition-colors duration-200"
                />
            </Card>
        </motion.div>
    );
};

export default AuctionSearchList;