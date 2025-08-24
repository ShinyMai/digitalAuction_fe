import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, Card } from "antd";
import AuctionServices from "../../../services/AuctionServices";
import AuctionDetail from "./components/AuctionDetail";
import type { AuctionDataDetail, AuctionDateModal } from "../Modals";
import ListAuctionDocumentCancelRefund from "./components/ListAuctionDocumentCancelRefund";
import { FileTextOutlined, MoneyCollectOutlined } from "@ant-design/icons";

const AuctionDetailCancel = () => {
  const { state } = useLocation();
  const auctionId = state?.key;
  const auctionType = state?.type;

  const [auctionDetailData, setAuctionDetailData] =
    useState<AuctionDataDetail>();
  const [auctionDateModal, setAuctionDateModal] = useState<AuctionDateModal>();

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
      const dateModal: AuctionDateModal = {
        auctionStartDate: data?.auctionStartDate,
        auctionEndDate: data?.auctionEndDate,
        registerOpenDate: data?.registerOpenDate,
        registerEndDate: data?.registerEndDate,
      };
      if (
        data.legalDocumentUrls &&
        typeof data.legalDocumentUrls === "string"
      ) {
        try {
          data.legalDocumentUrls = JSON.parse(data.legalDocumentUrls);
        } catch (parseError) {
          console.error("Error parsing legalDocumentUrls:", parseError);
          data.legalDocumentUrls = [];
        }
      }
      setAuctionDateModal(dateModal);
      setAuctionDetailData(data);
    } catch (error) {
      console.error("Error fetching auction detail:", error);
    }
  };

  // Hàm để refresh tất cả data khi chuyển tab
  const handleTabChange = async () => {
    try {
      if (auctionId) {
        await fetchAuctionDetail(auctionId);
      }
    } catch (error) {
      console.error("Error refreshing data on tab change:", error);
    }
  };

  return (
    <section className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-red-200/30 to-orange-200/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-orange-200/30 to-yellow-200/30 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-yellow-200/30 to-red-200/30 rounded-full animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full animate-float delay-3000"></div>
      </div>

      <div className="w-full mx-auto rounded-xl relative z-10">
        <Tabs
          defaultActiveKey="1"
          className="w-full cancel-tabs"
          onChange={handleTabChange}
          tabBarStyle={{
            background: "linear-gradient(135deg, #ffffff 0%, #fef7f7 100%)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #fecaca",
            boxShadow: "0 10px 25px rgba(239, 68, 68, 0.1)",
            backdropFilter: "blur(10px)",
            marginBottom: "24px",
          }}
          items={[
            {
              key: "1",
              label: (
                <div className="flex items-center gap-2 px-4 py-2">
                  <FileTextOutlined className="text-red-600" />
                  <span className="font-semibold text-gray-700">
                    Thông tin đấu giá
                  </span>
                </div>
              ),
              children: (
                <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0 rounded-2xl">
                  <AuctionDetail
                    auctionDetailData={auctionDetailData}
                    auctionType={auctionType}
                    auctionId={auctionId}
                  />
                </Card>
              ),
            },
            {
              key: "2",
              label: (
                <div className="flex items-center gap-2 px-4 py-2">
                  <MoneyCollectOutlined className="text-orange-600" />
                  <span className="font-semibold text-gray-700">
                    Danh sách cần hoàn tiền
                  </span>
                </div>
              ),
              children: (
                <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0 rounded-2xl">
                  <ListAuctionDocumentCancelRefund
                    auctionId={auctionId}
                    auctionDateModals={auctionDateModal}
                  />
                </Card>
              ),
            },
          ]}
        />
      </div>

      <style>{`
        .cancel-tabs .ant-tabs-tab {
          border-radius: 12px !important;
          transition: all 0.3s ease !important;
          margin: 0 4px !important;
        }
        
        .cancel-tabs .ant-tabs-tab:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          transform: translateY(-2px) !important;
        }
        
        .cancel-tabs .ant-tabs-tab-active {
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%) !important;
          color: white !important;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3) !important;
        }
        
        .cancel-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white !important;
        }
        
        .cancel-tabs .ant-tabs-tab-active .anticon {
          color: white !important;
        }
        
        .cancel-tabs .ant-tabs-content-holder {
          background: transparent !important;
        }
        
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

export default AuctionDetailCancel;
