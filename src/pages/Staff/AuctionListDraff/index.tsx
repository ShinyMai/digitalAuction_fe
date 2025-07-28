import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AuctionServices from "../../../services/AuctionServices";
import AuctionTable from "./component/AuctionTable";
import SearchAuctionTable from "./component/SearchAuctionTable";
import type { AuctionCategory, AuctionDataList } from "../Modals.ts";
import type { ApiResponse } from "../../../types/responseAxios";

interface SearchParams {
  AuctionName?: string;
  CategoryId?: number;
  SortBy?: string;
  IsAscending?: boolean;
  PageNumber?: number;
  PageSize?: number;
  Status: number;
  AuctionType?: string;
  ConditionAuction?: number;
}

interface SearchValue {
  auctionName?: string;
  CategoryId?: number;
  AuctionType?: string;
  ConditionAuction?: number;
}

interface PaginationChangeParams {
  current?: number;
  pageSize?: number;
}

const DEFAULT_PARAMS: SearchParams = {
  PageNumber: 1,
  PageSize: 8,
  Status: 0,
  AuctionType: "1",
  SortBy: "register_open_date",
  IsAscending: false,
};

const AuctionListDraff = () => {
  const [listAuctionCategory, setListAuctionCategory] = useState<AuctionCategory[]>([]);
  const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParams>(DEFAULT_PARAMS);

  const fetchAuctionCategories = useCallback(async (): Promise<void> => {
    try {
      const res: ApiResponse<AuctionCategory[]> = await AuctionServices.getListAuctionCategory();
      if (res.code === 200 && res.data) {
        setListAuctionCategory(res.data);
      } else {
        toast.error("Không có dữ liệu danh mục tài sản!");
      }
    } catch (error) {
      console.error("Error fetching auction categories:", error);
      toast.error("Lỗi khi tải danh mục đấu giá");
    }
  }, []);

  const fetchAuctionList = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const params: SearchParams = {
        PageNumber: searchParams.PageNumber ?? 1,
        PageSize: searchParams.PageSize ?? 8,
        Status: searchParams.Status,
        AuctionType: searchParams.AuctionType ?? "1",
        AuctionName: searchParams.AuctionName,
        CategoryId: searchParams.CategoryId,
        SortBy: searchParams.SortBy,
        IsAscending: searchParams.IsAscending,
      };
      const response =
        params.AuctionType === "2"
          ? await AuctionServices.getListAuctionNode(params)
          : await AuctionServices.getListAuction(params);

      if (response.code === 200 && response.data) {
        const data = response.data;
        setTotalData(data.totalCount || 0);
        setAuctionList(data.auctions || []);
      }
    } catch (error) {
      console.error("Error fetching auction list:", error);
      toast.error("Lỗi khi tải danh sách đấu giá!");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAuctionCategories();
  }, [fetchAuctionCategories]);

  useEffect(() => {
    fetchAuctionList();
  }, [fetchAuctionList]);

  const onSearch = (searchValue: SearchValue): void => {
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

    if (searchValue.AuctionType) {
      newParams.AuctionType = searchValue.AuctionType;
    } else {
      delete newParams.AuctionType;
    }

    if (searchValue.ConditionAuction) {
      newParams.ConditionAuction = searchValue.ConditionAuction;
    } else {
      delete newParams.AuctionType;
    }

    setSearchParams(newParams);
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
    </section>
  );
};

export default AuctionListDraff;
