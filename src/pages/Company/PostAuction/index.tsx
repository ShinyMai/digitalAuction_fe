import { useEffect, useState } from "react";
import AuctionCreateForm from "./components/AuctionCreateForm";
import AuctionServices from "../../../services/AuctionServices";
import type { AuctionCategory } from "./Modals";
import { toast } from "react-toastify";

const PostAuction = () => {

  const [listAuctionCategory, setListAuctionCategory] = useState<AuctionCategory[]>()

  useEffect(() => {
    getListAuctionCategory()
  }, [])

  const getListAuctionCategory = async () => {

    try {
      const res = await AuctionServices.getListAuctionCategory()
      if (res.data.data.length == 0) {
        toast.error("Không có dữ liệu lớp tài sản !")
      } else {
        setListAuctionCategory(res.data.data)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-7xl p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Tạo Đấu Giá Mới
        </h1>
        <div className="w-full bg-white rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
          {listAuctionCategory && <AuctionCreateForm auctionCategoryList={listAuctionCategory} />}
        </div>
      </div>
    </div>
  );
};

export default PostAuction;