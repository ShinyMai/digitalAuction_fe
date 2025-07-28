/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Typography } from "antd";
import { AnimatePresence } from "framer-motion";
import AuctionServices from "../../../services/AuctionServices/index.tsx";
import { toast } from "react-toastify";
import type { AuctionCategory, AuctionDataDetail, AuctionDataList } from "../Modals.ts";
import AuctionSearchList from "./components/AuctionSearchList.tsx";
import AuctionDetailView from "./components/AuctionDetailView.tsx";
import EkycSDK from "../../../components/Ekyc/EkycSDK.tsx";

const { Title } = Typography;

interface RegisterForm {
  bankAccount: string;
  citizenIdentification: string;
  phoneNumber: string;
  bankAccountNumber: string;
  bankBranch: string;
}

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
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  const [auctionDetail, setAuctionDetail] = useState<AuctionDataDetail | null>(null);
  const [account, setAccount] = useState({});
  const [listAuctionCategory, setListAuctionCategory] = useState<AuctionCategory[]>([]);
  const [step, setStep] = useState<"list" | "ekyc" | "detail">("list"); // Thêm bước ekyc

  console.log(submitting);

  useEffect(() => {
    if (step === "list") {
      fetchAuctionList();
      getListAuctionCategory();
    } else if (step === "detail" && selectedAuctionId) {
      fetchAuctionDetail(selectedAuctionId);
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
    setSelectedAuctionId(auctionId);
    setStep("ekyc"); // Chuyển sang bước ekyc
  };

  const handleEkycSuccess = () => {
    setStep("detail"); // Chuyển sang bước detail sau khi eKYC thành công
  };

  const handleBack = () => {
    setStep("list"); // Quay lại bước list
    setSelectedAuctionId(null);
    setAuctionDetail(null);
    setAccount({}); // Reset account để yêu cầu eKYC lại nếu cần
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

  const handleSubmit = async (values: RegisterForm, selectedAssetIds: string[]) => {
    if (!auctionDetail) {
      toast.error("Không tìm thấy thông tin đấu giá!");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        auctionId: selectedAuctionId,
        auctionAssetsIds: selectedAssetIds,
        ...values,
      };
      console.log("Check: ", payload);
      await AuctionServices.supportRegisterAuction(payload);
      toast.success("Đăng ký tham gia đấu giá thành công!");
    } catch (error: any) {
      toast.error("Lỗi khi đăng ký tham gia đấu giá!");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-h-screen p-4 sm:p-6">
      <div className="max-w-full mx-auto">
        <Title level={4} className="text-center mb-6 text-gray-800">
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
          {step === "ekyc" && (
            <EkycSDK
              setCurrent={handleEkycSuccess}
              setAccount={setAccount}
              face={true}
              className="w-full"
            />
          )}
          {step === "detail" && (
            <AuctionDetailView
              auctionDetail={auctionDetail}
              loading={loading}
              onBack={handleBack}
              onSubmit={handleSubmit}
              account={account}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SupportRegisterAuction;
