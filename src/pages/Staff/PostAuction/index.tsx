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
      <div className="w-full">
        <div className="w-full transition-shadow duration-300">
          {listAuctionCategory && (
            <AuctionCreateForm
              handleBackToSelection={handleBackToSelection}
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
