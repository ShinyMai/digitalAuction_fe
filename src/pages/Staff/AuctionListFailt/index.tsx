/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AuctionServices from "../../../services/AuctionServices/index.tsx";
import { toast } from "react-toastify";
import AuctionTable from "./component/AuctionTable.tsx";
import SearchAuctionTable from "./component/SearchAuctionTable.tsx";

import type { AuctionCategory, AuctionDataList } from "../Modals.ts";

interface SearchParams {
  AuctionName?: string;
  CategoryId?: number;
  SortBy?: string;
  IsAscending?: boolean;
  PageNumber?: number;
  PageSize?: number;
  Status: number;
  AuctionType?: string;
  CreateBy?: string;
}

interface SearchValue {
  auctionName?: string;
  CategoryId?: number;
  AuctionType?: string;
}

interface PaginationChangeParams {
  current?: number;
  pageSize?: number;
}

const DEFAULT_PARAMS: SearchParams = {
  PageNumber: 1,
  PageSize: 8,
  Status: 5,
  AuctionType: "1",
  SortBy: "register_open_date",
  IsAscending: false,
};

const AuctionListFailt = () => {
  const [listAuctionCategory, setListAuctionCategory] = useState<AuctionCategory[]>([]);
  const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParams>(DEFAULT_PARAMS);



  useEffect(() => {
    fetchAuctionCategories();
  }, []);

  useEffect(() => {
    fetchAuctionList();
  }, [searchParams]);
  const fetchAuctionCategories = async () => {
    try {
      const res = await AuctionServices.getListAuctionCategory();
      if (!res?.data?.length) {
        toast.error("Không có dữ liệu danh mục tài sản!");
        return;
      }
      setListAuctionCategory(res.data);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải danh mục!");
    }
  };

  const onSearch = (searchValue: SearchValue) => {
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



    setSearchParams(newParams);
  };

  const fetchAuctionList = async () => {
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

      setTotalData(response.data?.totalCount || 0);
      setAuctionList(response.data?.auctions || []);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách đấu giá!");
    } finally {
      setLoading(false);
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
            selectedAuctionType={searchParams.AuctionType}
          />
        </div>
      </div>
    </section>
  );
};

export default AuctionListFailt;
