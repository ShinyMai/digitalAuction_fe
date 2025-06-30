/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
import AuctionTable from "./component/AuctionTable";
import SearchAuctionTable from "./component/SearchAuctionTable";
import dayjs from "dayjs";
import type { AuctionCategory, AuctionDataList } from "../Modals.ts";
import { useLocation } from "react-router-dom";

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

const AuctionList = () => {
    const [listAuctionCategory, setListAuctionCategory] = useState<AuctionCategory[]>([]);
    const [totalData, setTotalData] = useState<number>(0);
    const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useState<SearchParams>({
        PageNumber: 1,
        PageSize: 8,
    });
    const location = useLocation();

    useEffect(() => {
        getListAuctionCategory();
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get("status");
        if (status) {
            setSearchParams((prev) => ({
                ...prev,
                PageNumber: 1,
                Status: status,
            }));
        }
    }, [location.search]);

    useEffect(() => {
        getListAuction();
    }, [searchParams]);

    useEffect(() => {
        console.log("Search Params:", searchParams);
    }, [searchParams]);

    const onSearch = (searchValue: any) => {
        const newParams: SearchParams = {
            ...searchParams,
            PageNumber: 1,
        };
        if (searchValue.auctionName) {
            newParams.AuctionName = searchValue.auctionName;
        } else {
            delete newParams.AuctionName;
        }
        if (searchValue.CategoryId) {
            newParams.CategoryId = searchValue.CategoryId;
        } else {
            delete newParams.CategoryId;
        }
        if (searchValue.registerRangeDate?.[0]) {
            newParams.RegisterOpenDate = dayjs(searchValue.registerRangeDate[0]).format("YYYY-MM-DD");
        } else {
            delete newParams.RegisterOpenDate;
        }
        if (searchValue.registerRangeDate?.[1]) {
            newParams.RegisterEndDate = dayjs(searchValue.registerRangeDate[1]).format("YYYY-MM-DD");
        } else {
            delete newParams.RegisterEndDate;
        }
        if (searchValue.auctionRangeDate?.[0]) {
            newParams.AuctionStartDate = dayjs(searchValue.auctionRangeDate[0]).format("YYYY-MM-DD");
        } else {
            delete newParams.AuctionStartDate;
        }
        if (searchValue.auctionRangeDate?.[1]) {
            newParams.AuctionEndDate = dayjs(searchValue.auctionRangeDate[1]).format("YYYY-MM-DD");
        } else {
            delete newParams.AuctionEndDate;
        }
        setSearchParams(newParams);
    };

    const getListAuction = async () => {
        try {
            setLoading(true);
            const params: SearchParams = {
                PageNumber: searchParams.PageNumber || 1,
                PageSize: searchParams.PageSize || 8,
            };
            if (searchParams.AuctionName) params.AuctionName = searchParams.AuctionName;
            if (searchParams.CategoryId) params.CategoryId = searchParams.CategoryId;
            if (searchParams.RegisterOpenDate) params.RegisterOpenDate = searchParams.RegisterOpenDate;
            if (searchParams.RegisterEndDate) params.RegisterEndDate = searchParams.RegisterEndDate;
            if (searchParams.AuctionStartDate) params.AuctionStartDate = searchParams.AuctionStartDate;
            if (searchParams.AuctionEndDate) params.AuctionEndDate = searchParams.AuctionEndDate;
            if (searchParams.SortBy) params.SortBy = searchParams.SortBy.replace("auctionName", "auction_name");
            if (searchParams.IsAscending !== undefined) params.IsAscending = searchParams.IsAscending;

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

    const onChangeTable = (pagination: any, sorter: any) => {
        const newParams: SearchParams = {
            ...searchParams,
            PageNumber: pagination.current,
            PageSize: pagination.pageSize,
        };
        if (sorter.field && sorter.order) {
            newParams.SortBy = sorter.field;
            newParams.IsAscending = sorter.order === "ascend";
        } else {
            delete newParams.SortBy;
            delete newParams.IsAscending;
        }
        setSearchParams(newParams);
    };

    return (
        <section className="w-full h-full p-4">
            <div className="w-full h-full">
                <div className="w-full h-full" id="table-list">
                    <AuctionTable
                        auctionData={auctionList}
                        headerTable={<SearchAuctionTable onSearch={onSearch} auctionCategory={listAuctionCategory} />}
                        onChange={onChangeTable}
                        total={totalData}
                        loading={loading}
                        pageSize={searchParams.PageSize}
                        currentPage={searchParams.PageNumber}
                    />
                </div>
            </div>
        </section>
    );
};

export default AuctionList;