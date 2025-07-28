/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import AuctionServices from "../../../services/AuctionServices";
import AuctionDetail from "./components/AuctionDetail";
import UpdateAuction from "./components/UpdateAuction";
import type { AuctionDataDetail } from "../Modals";
import { STAFF_ROUTES } from "../../../routers";
import { useSelector } from "react-redux";

const AuctionDetailAnonymous = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const auctionId = state?.key;
  const auctionType = state?.type;
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;
  const [auctionDetailData, setAuctionDetailData] = useState<AuctionDataDetail>();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (auctionId) {
      fetchAuctionDetail(auctionId);
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

  const handleGoBack = () => {
    navigate(`/${role.toLowerCase()}/${STAFF_ROUTES.SUB.AUCTION_LIST_DRAFF}`);
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  console.log("auctionDetailData", auctionDetailData);

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
        {/* Back Button and Edit Button */}
        <div className="mb-4 flex justify-between items-center">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            size="large"
          >
            Quay lại
          </Button>
          <Button
            type={isEditMode ? "default" : "primary"}
            icon={<EditOutlined />}
            onClick={handleEditToggle}
            className={`${isEditMode
              ? "bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl"
              : "bg-gradient-to-r from-blue-500 to-teal-500 border-0 hover:from-blue-600 hover:to-teal-600 shadow-lg hover:shadow-xl"
              } transition-all duration-300 hover:scale-105`}
            size="large"
          >
            {isEditMode ? "Xem chi tiết" : "Chỉnh sửa"}
          </Button>
        </div>

        <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0 rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {isEditMode ? (
              <motion.div
                key="update"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <UpdateAuction
                  auctionDetailData={auctionDetailData}
                  auctionType={auctionType}
                  auctionId={auctionId}
                />
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <AuctionDetail
                  auctionDetailData={auctionDetailData}
                  auctionType={auctionType}
                  auctionId={auctionId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
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
      `}</style>
    </section>
  );
};

export default AuctionDetailAnonymous;
