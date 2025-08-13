/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Typography, Button } from "antd";
import AuctionServices from "../../../services/AuctionServices";
import AuctionDetail from "./components/AuctionDetail";
import type { AuctionDataDetail, ModalAuctioners } from "../Modals";
import { toast } from "react-toastify";
import ModalsSelectAuctioners from "./components/ModalsSelectAuctionners";
import RejectReasonModal from "./components/RejectReasonModal";
import { TrophyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { MANAGER_ROUTES, STAFF_ROUTES } from "../../../routers";

const { Title } = Typography;

const AuctionDetailDraff = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const auctionId = state?.key;
  const auctionType = state?.type;
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;
  const [auctionDetailData, setAuctionDetailData] = useState<AuctionDataDetail>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
  const [listAuctioners, setListAuctioners] = useState<ModalAuctioners[]>([]);
  const [rejectLoading, setRejectLoading] = useState<boolean>(false);

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
        const response = await AuctionServices.assginAuctioneerAndPublicAuction({
          auctionId: selectedAuctionId,
          auctioneer: auctionerId,
        });
        if (response.code === 200) {
          toast.success(`Gán đấu giá viên và công khai phiên đấu giá thành công!`);
          navigate(`/${role.toLowerCase()}/${STAFF_ROUTES.SUB.AUCTION_LIST}`, { replace: true });
        } else {
          toast.warning(response.message)
        }
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

  // Hàm xử lý khi nhấn nút "Hủy thông tin"
  const handleReject = () => {
    if (auctionId) {
      setIsRejectModalOpen(true); // Mở modal để nhập lý do từ chối
    } else {
      toast.error("Không tìm thấy ID phiên đấu giá!");
    }
  };

  // Hàm xử lý xác nhận từ chối với lý do
  const handleConfirmReject = async (reason: string) => {
    if (!auctionId) {
      toast.error("Không tìm thấy ID phiên đấu giá!");
      return;
    }

    setRejectLoading(true);
    try {
      const response = await AuctionServices.updateAuctionRejected({ auctionId: auctionId, rejectReason: reason });
      if (response.code === 200) {
        toast.success("Đã từ chối đăng tải phiên đấu giá thành công!");
        setIsRejectModalOpen(false);
        navigate(`/${role.toLowerCase()}/${MANAGER_ROUTES.SUB.AUCTION_LIST_WAITING_PUBLIC}`);
      } else {
        toast.error(response.message || "Lỗi khi từ chối đăng tải phiên đấu giá!");
      }

      // Có thể redirect về trang danh sách sau khi từ chối

    } catch (error: any) {
      toast.error(error.message || "Lỗi khi từ chối đăng tải phiên đấu giá!");
      console.error(error);
    } finally {
      setRejectLoading(false);
    }
  };

  // Hàm đóng modal từ chối
  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
  };

  return (
    <section className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full animate-float delay-3000"></div>
      </div>

      <div className="w-full mx-auto rounded-xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/${role.toLowerCase()}/${MANAGER_ROUTES.SUB.AUCTION_LIST_WAITING_PUBLIC}`)}
              className="!text-slate-600 hover:!text-slate-800 hover:!bg-slate-100 !font-medium !px-4 !py-2 !h-auto !rounded-lg !transition-all !duration-200"
            >
              Quay lại
            </Button>

            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-full text-slate-700 shadow-sm">
              <TrophyOutlined className="text-xl text-slate-600" />
              <Title level={2} className="!text-slate-700 !mb-0">
                {user?.roleName?.toLowerCase() === "manager" ? "Duyệt Phiên Đấu Giá" : "Đang Chờ Duyệt"}
              </Title>
            </div>

            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-0 rounded-2xl overflow-hidden">
          <AuctionDetail
            auctionDetailData={auctionDetailData}
            auctionType={auctionType}
            auctionId={auctionId}
            onApprove={handleApprove} // Truyền hàm xử lý vào AuctionDetail
            onReject={handleReject} // Truyền hàm xử lý hủy vào AuctionDetail
          />
        </Card>

        <ModalsSelectAuctioners
          isOpen={isModalOpen}
          listAuctioners={listAuctioners}
          onClose={handleCloseModal}
          onSelect={handleSelectAuctioner}
        />

        <RejectReasonModal
          isOpen={isRejectModalOpen}
          onClose={handleCloseRejectModal}
          onConfirm={handleConfirmReject}
          loading={rejectLoading}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
        
        .delay-3000 {
          animation-delay: 3s;
        }
        
        .ant-card {
          border-radius: 16px !important;
        }
        
        .ant-card:hover {
          transform: translateY(-2px) !important;
        }
      `}</style>
    </section>
  );
};

export default AuctionDetailDraff;
