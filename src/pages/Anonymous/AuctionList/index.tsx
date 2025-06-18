import { Layout, Select, DatePicker, Button, Pagination, Spin, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import type { AuctionCategory, AuctionDataList } from "../../Company/Modals";
import AuctionCard from "./components/AuctionCard";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

const { Content, Sider } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

interface SearchParams {
    AuctionName?: string;
    CategoryId?: number;
    RegisterOpenDate?: string;
    RegisterEndDate?: string;
    AuctionStartDate?: string;
    AuctionEndDate?: string;
    SortBy?: string;
    IsAscending?: boolean;
    PageNumber?: number;
    PageSize?: number;
}

const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "auto",
    position: "sticky",
    insetInlineEnd: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#f8fafc",
    borderLeft: "1px solid #e2e8f0",
    padding: "16px",
};

const AuctionListAnonyMous = () => {
    const [listAuctionCategory, setListAuctionCategory] = useState<AuctionCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useState<SearchParams>({
        PageNumber: 1,
        PageSize: 9,
    });
    const [totalData, setTotalData] = useState<number>(0);
    const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);
    const location = useLocation()

    useEffect(() => {
        getListAuctionCategory();
        console.log("Key: ", location.state.key)
    }, []);

    useEffect(() => {
        getListAuction();
    }, [searchParams]);

    const getListAuctionCategory = async () => {
        try {
            const res = await AuctionServices.getListAuctionCategory();
            if (res.data.length === 0) {
                toast.error("Không có dữ liệu danh mục tài sản!");
            } else {
                setListAuctionCategory(res.data);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const getListAuction = async () => {
        try {
            setLoading(true);
            const params: SearchParams = {
                PageNumber: searchParams.PageNumber || 1,
                PageSize: searchParams.PageSize || 9,
            };
            if (searchParams.AuctionName) params.AuctionName = searchParams.AuctionName;
            if (searchParams.CategoryId) params.CategoryId = searchParams.CategoryId;
            if (searchParams.RegisterOpenDate) params.RegisterOpenDate = searchParams.RegisterOpenDate;
            if (searchParams.RegisterEndDate) params.RegisterEndDate = searchParams.RegisterEndDate;
            if (searchParams.AuctionStartDate) params.AuctionStartDate = searchParams.AuctionStartDate;
            if (searchParams.AuctionEndDate) params.AuctionEndDate = searchParams.AuctionEndDate;
            if (searchParams.SortBy) params.SortBy = searchParams.SortBy.replace("auctionName", "auction_name");
            if (searchParams.IsAscending !== undefined) params.IsAscending = false;

            const response = await AuctionServices.getListAuction(params);
            setTotalData(response.data.totalCount);
            setAuctionList(response.data.auctions);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách đấu giá!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (value: number | undefined) => {
        setSearchParams((prev) => ({
            ...prev,
            CategoryId: value,
            PageNumber: 1, // Reset về trang 1 khi thay đổi bộ lọc
        }));
    };

    const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
        setSearchParams((prev) => ({
            ...prev,
            AuctionStartDate: dateStrings[0] ? dayjs(dateStrings[0]).format("YYYY-MM-DD") : undefined,
            AuctionEndDate: dateStrings[1] ? dayjs(dateStrings[1]).format("YYYY-MM-DD") : undefined,
            PageNumber: 1, // Reset về trang 1 khi thay đổi bộ lọc
        }));
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setSearchParams((prev) => ({
            ...prev,
            PageNumber: page,
            PageSize: pageSize,
        }));
    };

    return (
        <Layout className="bg-gray-50 min-h-screen">
            <Sider style={siderStyle} theme="light" width={300}>
                <Title level={4} className="mb-4">
                    Tìm kiếm phiên đấu giá
                </Title>
                <div className="flex flex-col gap-4">
                    <Select
                        placeholder="Chọn danh mục tài sản"
                        allowClear
                        onChange={handleCategoryChange}
                        options={listAuctionCategory.map((category) => ({
                            value: category.categoryId,
                            label: category.categoryName,
                        }))}
                        className="w-full"
                    />
                    <RangePicker
                        placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                        onChange={handleDateRangeChange}
                        format="DD/MM/YYYY"
                        className="w-full"
                    />
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={getListAuction}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                        Tìm kiếm
                    </Button>
                </div>
            </Sider>
            <Content className="p-4 md:p-8">
                <Title level={2} className="text-center mb-6 text-3xl md:text-4xl">
                    Danh sách phiên đấu giá
                </Title>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        {/* Phân trang được đưa lên đầu */}
                        <Pagination
                            className="text-center mb-6 [&_.ant-control-item]:bg-transparent [&_.ant-control-item]:border-none [&_.ant-pagination-item]:text-gray-600 [&_.ant-pagination-item]:text-sm [&_.ant-pagination-item]:px-2 [&_.ant-pagination-item]:py-1 [&_.ant-pagination-item]:cursor-pointer hover:[&_.ant-pagination-item]:text-blue-500 hover:[&_.ant-pagination-item]:underline [&_.ant-pagination-item-active]:text-blue-500 [&_.ant-pagination-item-active]:font-semibold [&_.ant-pagination-item-disabled]:text-gray-300 [&_.ant-pagination-item-disabled]:cursor-not-allowed [&_.ant-pagination-prev]:bg-transparent [&_.ant-pagination-prev]:border-none [&_.ant-pagination-prev]:text-gray-600 [&_.ant-pagination-prev]:text-sm [&_.ant-pagination-prev]:cursor-pointer hover:[&_.ant-pagination-prev]:text-blue-500 [&_.ant-pagination-next]:bg-transparent [&_.ant-pagination-next]:border-none [&_.ant-pagination-next]:text-gray-600 [&_.ant-pagination-next]:text-sm [&_.ant-pagination-next]:cursor-pointer hover:[&_.ant-pagination-next]:text-blue-500 [&_.ant-pagination-prev.ant-pagination-disabled]:text-gray-300 [&_.ant-pagination-prev.ant-pagination-disabled]:cursor-not-allowed [&_.ant-pagination-next.ant-pagination-disabled]:text-gray-300 [&_.ant-pagination-next.ant-pagination-disabled]:cursor-not-allowed [&_.ant-pagination-jump-prev]:text-gray-600 
                            hover:[&_.ant-pagination-jump-prev]:text-blue-500 [&_.ant-pagination-jump-next]:text-gray-600 hover:[&_.ant-pagination-jump-next]:text-blue-500"
                            current={searchParams.PageNumber}
                            pageSize={searchParams.PageSize}
                            total={totalData}
                            onChange={handlePageChange}
                            showSizeChanger
                            pageSizeOptions={["9", "18", "27"]}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 mt-8">
                            {auctionList.length > 0 ? (
                                auctionList.map((item) => <AuctionCard key={item.auctionId} dataCard={item} />)
                            ) : (
                                <div className="col-span-full text-center text-gray-500">
                                    Không có phiên đấu giá nào phù hợp.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default AuctionListAnonyMous;