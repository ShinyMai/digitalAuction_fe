/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AuctionCreateForm from "./components/AuctionCreateForm";
import AuctionTypeSelection from "./components/AuctionTypeSelection";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
import type { AuctionCategory } from "../Modals";

type AuctionCreationType = "NODE" | "SQL" | null;

const PostAuction = () => {
  const [listAuctionCategory, setListAuctionCategory] = useState<AuctionCategory[]>();
  const [selectedType, setSelectedType] = useState<AuctionCreationType>(null);

  useEffect(() => {
    getListAuctionCategory();
  }, []);

  const getListAuctionCategory = async () => {
    try {
      const res = await AuctionServices.getListAuctionCategory();
      if (res.data.length === 0) {
        toast.error("Không có dữ liệu lớp tài sản!");
      } else {
        setListAuctionCategory(res.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleTypeSelection = (type: AuctionCreationType) => {
    setSelectedType(type);
  };

  const handleBackToSelection = () => {
    setSelectedType(null);
  };

  // Nếu chưa chọn loại, hiển thị màn hình lựa chọn
  if (!selectedType) {
    return <AuctionTypeSelection onSelect={handleTypeSelection} />;
  }

  // Hiển thị form tạo đấu giá với type đã chọn
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white py-4 sm:py-6 md:py-8">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToSelection}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-center flex-1">
            Tạo Đấu Giá Mới - {selectedType === "NODE" ? "Theo lô" : "Từng tài sản"}
          </h1>
          <div className="w-20"></div>
        </div>
        <div className="w-full transition-shadow duration-300">
          {listAuctionCategory && (
            <AuctionCreateForm
              auctionCategoryList={listAuctionCategory}
              auctionType={selectedType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostAuction;
