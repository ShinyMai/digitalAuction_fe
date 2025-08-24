import { useEffect, useState, useCallback } from "react";
import type { Auctions } from "../../Auctioneer/ModalsDatabase";
import CalendarViewContent from "./components/CalendarViewContent";
import "../../../styles/auction-tabs.css";
import AuctionServices from "../../../services/AuctionServices";

interface ListAuctionAssignedProps {
  loading?: boolean;
}

interface SearchParams {
  AuctionName?: string;
  CategoryId?: number;
  SortBy?: string;
  IsAscending?: boolean;
  PageNumber?: number;
  PageSize?: number;
  Status?: number;
  AuctionType?: string;
  ConditionAuction?: number;
}

// Interface cho dữ liệu API thực tế
interface ApiAuction {
  auctionId: string;
  auctionName: string;
  categoryId: number;
  status: number;
  registerOpenDate: string;
  registerEndDate: string;
  auctionStartDate: string;
  auctionEndDate: string;
  createdByUserName: string;
  updateByUserName: string;
  auctioneerBy: string;
}

const ListAuctionAssigned: React.FC<ListAuctionAssignedProps> = ({
  loading = false,
}) => {
  const [assignedAuctions, setAssignedAuctions] = useState<Auctions[]>([]);
  const [searchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 8,
    AuctionType: "1",
    SortBy: "register_open_date",
    IsAscending: false,
  });

  // Function chuyển đổi dữ liệu API sang format Auctions
  const convertApiToAuctions = useCallback(
    (apiData: ApiAuction[]): Auctions[] => {
      return apiData.map((item) => ({
        AuctionId: item.auctionId,
        AuctionName: item.auctionName,
        AuctionDescription: "",
        AuctionRules: "",
        AuctionPlanningMap: "",
        RegisterOpenDate: item.registerOpenDate,
        RegisterEndDate: item.registerEndDate,
        AuctionStartDate: item.auctionStartDate,
        AuctionEndDate: item.auctionEndDate,
        AuctionMap: "",
        CreatedAt: "",
        CreatedBy: item.createdByUserName,
        UpdatedAt: "",
        UpdatedBy: item.updateByUserName,
        QRLink: "",
        NumberRoundMax: 1,
        Status: item.status,
        WinnerData: "",
        CategoryId: item.categoryId.toString(),
        AuctioneersId: item.auctioneerBy,
        CancelReason: "",
        CancelReasonFile: "",
      }));
    },
    []
  );

  const getListAuctionAssigned = useCallback(async () => {
    try {
      const baseParams = {
        PageNumber: searchParams.PageNumber ?? 1,
        PageSize: searchParams.PageSize ?? 8,
        AuctionName: searchParams.AuctionName,
        CategoryId: searchParams.CategoryId,
        SortBy: searchParams.SortBy,
        IsAscending: searchParams.IsAscending,
      };

      // Gọi 3 API song song để lấy tất cả ConditionAuction: 1, 2, 3
      const [response1, response2, response3] = await Promise.all([
        AuctionServices.getListAuction({ ...baseParams, ConditionAuction: 1 }),
        AuctionServices.getListAuction({ ...baseParams, ConditionAuction: 2 }),
        AuctionServices.getListAuction({ ...baseParams, ConditionAuction: 3 }),
      ]);

      // Merge kết quả từ 3 API
      const allAuctions = [
        ...(response1.data.auctions || []),
        ...(response2.data.auctions || []),
        ...(response3.data.auctions || []),
      ];

      const convertedData = convertApiToAuctions(allAuctions);
      setAssignedAuctions(convertedData);
    } catch (error) {
      console.error("Error fetching assigned auctions:", error);
      setAssignedAuctions([]);
    }
  }, [searchParams, convertApiToAuctions]);

  useEffect(() => {
    getListAuctionAssigned();
  }, [getListAuctionAssigned]);

  return (
    <CalendarViewContent
      loading={loading}
      auctions={assignedAuctions}
    />
  );
};

export default ListAuctionAssigned;
