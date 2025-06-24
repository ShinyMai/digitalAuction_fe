/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AuctionCreateForm from "./components/AuctionCreateForm";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
import type { AuctionCategory } from "../Modals";

const PostAuction = () => {
    const [listAuctionCategory, setListAuctionCategory] = useState<AuctionCategory[]>();

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

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-white py-4 sm:py-6 md:py-8">
            <div className="w-full max-w-5xl">
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text mb-8 text-center">
                    Tạo Đấu Giá Mới
                </h1>
                <div className="w-full   p-6 sm:p-8  hover:shadow-xl transition-shadow duration-300">
                    {listAuctionCategory && <AuctionCreateForm auctionCategoryList={listAuctionCategory} />}
                </div>
            </div>
        </div>
    );
};

export default PostAuction;