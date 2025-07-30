/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Typography } from "antd";
import { AnimatePresence } from "framer-motion";
import AuctionServices from "../../../services/AuctionServices/index.tsx";
import { toast } from "react-toastify";
import type {
  AuctionCategory,
  AuctionDataDetail,
  AuctionDataList,
} from "../Modals.ts";
import AuctionSearchList from "./components/AuctionSearchList.tsx";
import AuctionDetailView from "./components/AuctionDetailView.tsx";
import ChooseUserType from "./components/ChooseUserType";
import FormRegisterUser from "./components/FormRegisterUser";

const { Title } = Typography;
interface SearchParams {
  AuctionName?: string;
  CategoryId?: number;
  SortBy?: string;
  IsAscending?: boolean;
  PageNumber?: number;
  PageSize?: number;
  Status: number;
  ConditionAuction?: number;
}

const SupportRegisterAuction = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 5,
    Status: 1,
    SortBy: "RegisterEndDate",
    IsAscending: false,
    ConditionAuction: 1,
  });
  const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(
    null
  );
  const [auctionDetail, setAuctionDetail] = useState<AuctionDataDetail | null>(
    null
  );
  const [listAuctionCategory, setListAuctionCategory] = useState<
    AuctionCategory[]
  >([]);
  const [step, setStep] = useState<"list" | "detail">("list");
  const [chooseUserTypeOpen, setChooseUserTypeOpen] = useState(false);
  const [pendingAuctionId, setPendingAuctionId] = useState<string | null>(null);
  const [userType, setUserType] = useState<"old" | "new" | null>(null);
  const [formRegisterUserOpen, setFormRegisterUserOpen] = useState(false);
  const [auctionId, setAuctionId] = useState<string | null>(null);

  console.log(userType);

  useEffect(() => {
    if (step === "list") {
      fetchAuctionList();
      getListAuctionCategory();
    } else if (step === "detail" && selectedAuctionId) {
      fetchAuctionDetail(selectedAuctionId);
      setAuctionId(selectedAuctionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, step, selectedAuctionId]);

  const fetchAuctionList = async () => {
    try {
      setLoading(true);
      const params = {
        PageNumber: searchParams.PageNumber,
        PageSize: searchParams.PageSize,
        AuctionName: searchParams.AuctionName || undefined,
        SortBy: searchParams.SortBy,
        IsAscending: searchParams.IsAscending,
        ConditionAuction: searchParams.ConditionAuction || 1,
        Status: searchParams.Status,
        CategoryId: searchParams.CategoryId || undefined,
      };
      const response = await AuctionServices.getListAuction(params);
      setAuctionList(response.data.auctions);
      setTotalData(response.data.totalCount);
    } catch (error: any) {
      toast.error("Lỗi khi tải danh sách đấu giá!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuctionDetail = async (auctionId: string) => {
    try {
      setLoading(true);
      const response = await AuctionServices.getAuctionDetail(auctionId);
      setAuctionDetail(response.data);
    } catch (error: any) {
      toast.error("Lỗi khi tải chi tiết đấu giá!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAuction = (auctionId: string) => {
    setPendingAuctionId(auctionId);
    setChooseUserTypeOpen(true);
  };

  const handleChooseUserType = (type: "old" | "new") => {
    setUserType(type);
    setChooseUserTypeOpen(false);
    if (type === "new") {
      setFormRegisterUserOpen(true);
    } else {
      setSelectedAuctionId(pendingAuctionId);
      setStep("detail");
    }
  };

  const handleRegisterUserSuccess = () => {
    setFormRegisterUserOpen(false);
    setSelectedAuctionId(pendingAuctionId);
    setStep("detail");
  };

  const handleBack = () => {
    setStep("list");
    setSelectedAuctionId(null);
    setAuctionDetail(null);
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

  return (
    <div className="w-full min-h-screen p-4 sm:p-6">
      <div className="max-w-full mx-auto">
        <Title level={4} className="!text-center !mb-6 !text-gray-800">
          Hỗ Trợ Đăng Ký Tham Gia Đấu Giá
        </Title>
        <AnimatePresence mode="wait">
          {step === "list" && (
            <AuctionSearchList
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              auctionList={auctionList}
              totalData={totalData}
              loading={loading}
              onSelectAuction={handleSelectAuction}
              listAuctionCategory={listAuctionCategory}
            />
          )}
          {step === "detail" && (
            <AuctionDetailView
              auctionDetail={auctionDetail}
              loading={loading}
              onBack={handleBack}
              auctionId={auctionId}
            />
          )}
        </AnimatePresence>
        <ChooseUserType
          open={chooseUserTypeOpen}
          onClose={() => setChooseUserTypeOpen(false)}
          onSelect={handleChooseUserType}
        />
        <FormRegisterUser
          open={formRegisterUserOpen}
          onClose={() => setFormRegisterUserOpen(false)}
          onSuccess={handleRegisterUserSuccess}
        />
      </div>
    </div>
  );
};

export default SupportRegisterAuction;
