/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
import AuctionTable from "./component/AuctionTable";
import SearchAuctionTable from "./component/SearchAuctionTable";
import type { AuctionCategory, AuctionDataList } from "../Modals";
import dayjs from "dayjs";

interface SearchParams {
  AuctionName?: string;
  CategoryId?: number;
  SortBy?: string;
  IsAscending?: boolean;
  PageNumber: number;
  PageSize: number;
  RegisterOpenDate?: string;
  RegisterEndDate?: string;
  AuctionStartDate?: string;
  AuctionEndDate?: string;
  Status: number;
}

interface PaginationChangeParams {
  current?: number;
  pageSize?: number;
}

const AuctionListNow = () => {
  const [listAuctionCategory, setListAuctionCategory] = useState<AuctionCategory[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 8,
    AuctionStartDate: dayjs().format("YYYY-MM-DD"),
    AuctionEndDate: dayjs().add(3, "day").format("YYYY-MM-DD"),
    Status: 1,
  });

  useEffect(() => {
    getListAuctionCategory();
  }, [location.search]);

  useEffect(() => {
    getListAuction();
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
    setSearchParams(newParams);
  };

  const getListAuction = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        PageNumber: searchParams.PageNumber || 1,
        PageSize: searchParams.PageSize || 8,
        Status: searchParams.Status,
        AuctionStartDate: searchParams.AuctionStartDate,
        AuctionEndDate: searchParams.AuctionEndDate,
      };
      if (searchParams.AuctionName) params.AuctionName = searchParams.AuctionName;
      if (searchParams.CategoryId) params.CategoryId = searchParams.CategoryId;
      if (searchParams.SortBy)
        params.SortBy = searchParams.SortBy.replace("auctionName", "auction_name");
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

  const onChangeTable = (pagination: PaginationChangeParams): void => {
    const newParams: SearchParams = {
      ...searchParams,
      PageNumber: pagination.current || 1,
      PageSize: pagination.pageSize || 8,
      SortBy: searchParams.SortBy,
      IsAscending: searchParams.IsAscending,
    };

    setSearchParams(newParams);
  };

  return (
    <section className="w-full h-full p-4">
      <div className="w-full h-full">
        <div className="w-full h-full" id="table-list">
          <AuctionTable
            auctionData={auctionList}
            headerTable={
              <SearchAuctionTable onSearch={onSearch} auctionCategory={listAuctionCategory} />
            }
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

export default AuctionListNow;
