/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AuctionServices from "../../../services/AuctionServices/index.tsx";
import { toast } from "react-toastify";
import AuctionTable from "./component/AuctionTable.tsx";
import SearchAuctionTable from "./component/SearchAuctionTable.tsx";
import ModalsSelectAuctioners from "./component/ModalsSelectAuctionners.tsx"; // Import modal
import dayjs from "dayjs";
import type { AuctionCategory, AuctionDataList, ModalAuctioners } from "../../Staff/Modals.ts";

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
  AuctionType?: string;
}

interface SearchValue {
  auctionName?: string;
  CategoryId?: number;
  AuctionType?: string;
  registerRangeDate?: any[];
  auctionRangeDate?: any[];
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
  const [listAuctioners, setListAuctioners] = useState<ModalAuctioners[]>([]);
  const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State cho modal
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null); // Lưu auction được chọn
  const [searchParams, setSearchParams] = useState<SearchParams>(DEFAULT_PARAMS);
  useEffect(() => {
    fetchAuctionCategories();
    fetchAuctioners();
  }, []);

  useEffect(() => {
    fetchAuctionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fetchAuctioners = async () => {
    try {
      const res = await AuctionServices.getListAuctioners();
      if (!res?.data?.length) {
        toast.error("Không có đấu giá viên!");
        return;
      }
      setListAuctioners(res.data);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải danh sách đấu giá viên!");
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
        RegisterOpenDate: searchParams.RegisterOpenDate,
        RegisterEndDate: searchParams.RegisterEndDate,
        AuctionStartDate: searchParams.AuctionStartDate,
        AuctionEndDate: searchParams.AuctionEndDate,
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

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAuctionId(null);
  };

  // Hàm xử lý khi chọn auctioner
  const handleSelectAuctioner = async (auctionerId: string) => {
    if (selectedAuctionId && auctionerId) {
      try {
        //Giả định có API để gán auctioner cho auction
        await AuctionServices.assginAuctioneerAndPublicAuction({
          auctionId: selectedAuctionId,
          auctioneer: auctionerId,
        });
        toast.success(`Gán đấu giá viên thành công!`);
        fetchAuctionList(); // Làm mới danh sách
        handleCloseModal();
      } catch (error) {
        toast.error("Lỗi khi gán đấu giá viên!");
        console.error(error);
      }
    }
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
          <ModalsSelectAuctioners
            isOpen={isModalOpen}
            listAuctioners={listAuctioners}
            onClose={handleCloseModal}
            onSelect={handleSelectAuctioner}
          />
        </div>
      </div>
    </section>
  );
};

export default AuctionListDraff;
