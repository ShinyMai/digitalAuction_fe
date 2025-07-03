import { Layout, DatePicker, Button, Pagination, Spin, Typography } from "antd";
import { SearchOutlined, FrownOutlined } from "@ant-design/icons";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import AuctionCard from "./components/AuctionCard";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import type { AuctionDataList } from "../Modals";

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
    backgroundColor: "#e6f4fa",
    borderLeft: "1px solid #bfdbfe",
    padding: "16px",
};

const AuctionListAnonyMous = () => {
    // const [listAuctionCategory, setListAuctionCategory] = useState<AuctionCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const location = useLocation();
    const [searchParams, setSearchParams] = useState<SearchParams>({
        PageNumber: 1,
        PageSize: 9,
        CategoryId: location.state?.key
    });
    const [totalData, setTotalData] = useState<number>(0);
    const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);

    useEffect(() => {
        getListAuction();
    }, []);


    const getListAuction = async () => {
        try {
            setLoading(true);
            const params: SearchParams = {
                PageNumber: searchParams.PageNumber || 1,
                PageSize: searchParams.PageSize || 9,
                CategoryId: location.state?.key, // Luôn bao gồm CategoryId từ location.state.key
            };
            if (searchParams.AuctionName) params.AuctionName = searchParams.AuctionName;
            if (searchParams.RegisterOpenDate) params.RegisterOpenDate = searchParams.RegisterOpenDate;
            // if (searchParams.RegisterEndDate) params.RegisterEndDate;
            if (searchParams.AuctionStartDate) params.AuctionStartDate = searchParams.AuctionStartDate;
            if (searchParams.AuctionEndDate) params.AuctionEndDate = searchParams.AuctionEndDate;
            if (searchParams.SortBy) params.SortBy = searchParams.SortBy.replace("auctionName", "auction_name");
            if (searchParams.IsAscending !== undefined) params.IsAscending = false;

            const response = await AuctionServices.getListAuction(params);
            setTotalData(response.data.totalCount || 0);
            setAuctionList(response.data.auctions || []);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách đấu giá!");
            console.error(error);
            setAuctionList([]); // Đảm bảo danh sách rỗng khi có lỗi
            setTotalData(0);
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
        setSearchParams((prev) => ({
            ...prev,
            AuctionStartDate: dateStrings[0] ? dayjs(dateStrings[0]).format("YYYY-MM-DD") : undefined,
            AuctionEndDate: dateStrings[1] ? dayjs(dateStrings[1]).format("YYYY-MM-DD") : undefined,
            PageNumber: 1,
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
        <Layout className="bg-gradient-to-b from-blue-50 to-teal-50 min-h-screen">
            <Sider style={siderStyle} theme="light" width={300}>
                <Title level={4} className="mb-4 text-blue-800">
                    Tìm kiếm phiên đấu giá
                </Title>
                <div className="flex flex-col gap-4">
                    <RangePicker
                        placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                        onChange={handleDateRangeChange}
                        format="DD/MM/YYYY"
                        className="w-full [&_.ant-picker]:border-teal-200 [&_.ant-picker]:bg-blue-50"
                    />
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={getListAuction}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold"
                    >
                        Tìm kiếm
                    </Button>
                </div>
            </Sider>
            <Content className="p-4 md:p-8 min-h-screen">
                <Title level={2} className="text-center mb-6 text-3xl md:text-4xl text-blue-800">
                    Danh sách phiên đấu giá
                </Title>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" className="text-teal-600" />
                    </div>
                ) : (
                    <>
                        <Pagination
                            className="text-center mb-6 text-teal-700 [&_.ant-pagination-item]:opacity-80 [&_.ant-pagination-item]:bg-transparent [&_.ant-pagination-item]:border-none [&_.ant-pagination-item]:text-teal-600 [&_.ant-pagination-item]:hover:text-blue-500 [&_.ant-pagination-item]:hover:opacity-100 [&_.ant-pagination-item-active]:text-blue-500 [&_.ant-pagination-item-active]:font-semibold [&_.ant-pagination-item-active]:opacity-100 [&_.ant-pagination-prev]:bg-transparent [&_.ant-pagination-prev]:border-none [&_.ant-pagination-prev]:text-teal-600 [&_.ant-pagination-prev]:hover:text-blue-500 [&_.ant-pagination-next]:bg-transparent [&_.ant-pagination-next]:border-none [&_.ant-pagination-next]:text-teal-600 [&_.ant-pagination-next]:hover:text-blue-500 [&_.ant-pagination-prev.ant-pagination-disabled]:text-teal-300 [&_.ant-pagination-prev.ant-pagination-disabled]:opacity-80 [&_.ant-pagination-next.ant-pagination-disabled]:text-teal-300 [&_.ant-pagination-next.ant-pagination-disabled]:opacity-80 [&_.ant-pagination-jump-prev]:text-teal-600 [&_.ant-pagination-jump-prev]:hover:text-blue-500 [&_.ant-pagination-jump-next]:text-teal-600 [&_.ant-pagination-jump-next]:hover:text-blue-500"
                            current={searchParams.PageNumber}
                            pageSize={searchParams.PageSize}
                            total={totalData}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 mt-8">
                            {auctionList.length > 0 ? (
                                auctionList.map((item) => <AuctionCard key={item.auctionId} dataCard={item} />)
                            ) : (
                                <div className="col-span-full text-center text-teal-600 bg-blue-50 p-6 rounded-lg flex flex-col items-center justify-center">
                                    <FrownOutlined style={{ fontSize: '48px', color: '#08979c', marginBottom: '16px' }} />
                                    <span className="text-lg">Không có dữ liệu phiên đấu giá</span>
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