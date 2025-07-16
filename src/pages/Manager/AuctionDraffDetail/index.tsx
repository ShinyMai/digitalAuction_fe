/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AuctionServices from "../../../services/AuctionServices";
import AuctionDetail from "./components/AuctionDetail";
import type { AuctionDataDetail, ModalAuctioners } from "../Modals";
import { toast } from "react-toastify";
import ModalsSelectAuctioners from "./components/ModalsSelectAuctionners";

const AuctionDetailDraff = () => {
  const { state } = useLocation();
  const auctionId = state?.key;
  const auctionType = state?.type;

  const [auctionDetailData, setAuctionDetailData] = useState<AuctionDataDetail>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  const [listAuctioners, setListAuctioners] = useState<ModalAuctioners[]>([]);

  useEffect(() => {
    if (auctionId) {
      fetchAuctionDetail(auctionId);
      fetchAuctioners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId]);

  const fetchAuctionDetail = async (id: string) => {
    try {
      const { data } =
        auctionType === "NODE"
          ? await AuctionServices.getAuctionDetailNode(id)
          : await AuctionServices.getAuctionDetail(id);
      setAuctionDetailData(data);
    } catch (error) {
      console.error("Error fetching auction detail:", error);
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

  const handleSelectAuctioner = async (auctionerId: string) => {
    if (selectedAuctionId && auctionerId) {
      try {
        await AuctionServices.assginAuctioneerAndPublicAuction({
          auctionId: selectedAuctionId,
          auctioneer: auctionerId,
        });
        toast.success(`Gán đấu giá viên và công khai phiên đấu giá thành công!`);
        handleCloseModal();
        // Tải lại chi tiết phiên đấu giá sau khi gán thành công
        fetchAuctionDetail(auctionId);
      } catch (error) {
        toast.error("Lỗi khi gán đấu giá viên hoặc công khai phiên đấu giá!");
        console.error(error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAuctionId(null);
  };

  // Hàm xử lý khi nhấn nút "Duyệt thông tin"
  const handleApprove = () => {
    if (auctionId) {
      setSelectedAuctionId(auctionId);
      setIsModalOpen(true); // Mở modal để chọn đấu giá viên
    } else {
      toast.error("Không tìm thấy ID phiên đấu giá!");
    }
  };

  return (
    <section className="p-6 bg-gradient-to-b from-blue-50 to-teal-50 min-h-screen">
      <div className="w-full mx-auto rounded-lg">
        <AuctionDetail
          auctionDetailData={auctionDetailData}
          auctionType={auctionType}
          auctionId={auctionId}
          onApprove={handleApprove} // Truyền hàm xử lý vào AuctionDetail
        />
        <ModalsSelectAuctioners
          isOpen={isModalOpen}
          listAuctioners={listAuctioners}
          onClose={handleCloseModal}
          onSelect={handleSelectAuctioner}
        />
      </div>
    </section>
  );
};

export default AuctionDetailDraff;
