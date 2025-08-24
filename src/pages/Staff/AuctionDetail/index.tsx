import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, Card } from "antd";
import AuctionServices from "../../../services/AuctionServices";
import AuctionDetail from "./components/AuctionDetail";
import ListAuctionDocument from "./components/ListAuctionDocument";
import ListAuctionDocumentSuccessRegister from "./components/ListAuctionDocumentSuccessRegister";
import type { AuctionDataDetail, AuctionDateModal } from "../Modals";
import {
  FileTextOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { RootState } from "../../../store/store";
import { useSelector } from "react-redux";

const AuctionDetailAnonymous = () => {
  const { state } = useLocation();
  const auctionId = state?.key;
  const auctionType = state?.type;
  const { user } = useSelector((state: RootState) => state.auth);
  const [auctionDetailData, setAuctionDetailData] =
    useState<AuctionDataDetail>();
  const [auctionDateModal, setAuctionDateModal] = useState<AuctionDateModal>();
  const [refreshKey, setRefreshKey] = useState(0);

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
      setAuctionDateModal(dateModal);
      // Xử lý staffIncharge từ chuỗi thành array
      if (data && data.staffInCharge) {
        data.staffInCharge = data.staffInCharge
          .split(",")
          .map((id: string) => id.trim())
          .filter((id: string) => id !== "");
      }
      console.log("Check Data", data);
      setAuctionDetailData(data);
    } catch (error) {
      console.error("Error fetching auction detail:", error);
    }
  };

  // Callback để refresh data khi có thay đổi từ các component con
  const handleDataChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Hàm kiểm tra quyền truy cập tab 2 và tab 3
  const checkTabAccess = () => {
    if (!auctionDetailData || !user) return false;

    const userRole = user.roleName?.toLowerCase();
    const userId = user.id;

    // Trường hợp 1: Manager
    if (userRole === "manager") {
      return userId === auctionDetailData.managerInCharge;
    }

    // Trường hợp 2: Staff
    if (userRole === "staff") {
      return (
        auctionDetailData.staffInCharge &&
        Array.isArray(auctionDetailData.staffInCharge) &&
        auctionDetailData.staffInCharge.includes(userId)
      );
    }

    return false;
  };

  const canAccessRegistrationTabs = checkTabAccess();

  // Tạo danh sách tabs động dựa trên quyền truy cập
  const tabItems = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-2 px-4 py-2">
          <FileTextOutlined className="!text-blue-600" />
          <span className="font-semibold text-gray-700">Thông tin đấu giá</span>
        </div>
      ),
      children: (
        <Card className="!shadow-xl !bg-white/70 !backdrop-blur-sm !border-0 !rounded-2xl">
          <AuctionDetail
            auctionDetailData={auctionDetailData}
            auctionType={auctionType}
            auctionId={auctionId}
          />
        </Card>
      ),
    },
    ...(canAccessRegistrationTabs
      ? [
          {
            key: "2",
            label: (
              <div className="flex items-center gap-2 px-4 py-2">
                <TeamOutlined className="!text-teal-600" />
                <span className="font-semibold text-gray-700">
                  Danh sách đăng ký
                </span>
              </div>
            ),
            children: (
              <Card className="!shadow-xl !bg-white/70 !backdrop-blur-sm !border-0 !rounded-2xl">
                <ListAuctionDocument
                  key={`auction-docs-${refreshKey}`}
                  auctionId={auctionId}
                  auctionDetailData={auctionDetailData}
                  onDataChange={handleDataChange}
                />
              </Card>
            ),
          },
          {
            key: "3",
            label: (
              <div className="flex items-center gap-2 px-4 py-2">
                <CheckCircleOutlined className="!text-green-600" />
                <span className="font-semibold text-gray-700">
                  Đăng ký thành công
                </span>
              </div>
            ),
            children: (
              <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0 rounded-2xl">
                <ListAuctionDocumentSuccessRegister
                  key={`success-docs-${refreshKey}`}
                  auctionId={auctionId}
                  auctionDateModals={auctionDateModal}
                  auctionDetailData={auctionDetailData}
                />
              </Card>
            ),
          },
        ]
      : []),
  ];

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
        <Tabs
          defaultActiveKey="1"
          className="w-full staff-tabs"
          tabBarStyle={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            padding: "24px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
            marginBottom: "24px",
          }}
          items={tabItems}
        />
      </div>

      <style>{`
        .staff-tabs .ant-tabs-tab {
          border-radius: 12px !important;
          transition: all 0.3s ease !important;
          margin: 0 4px !important;
        }

        .staff-tabs .ant-tabs-tab:hover {
          transform: translateY(-2px) !important;
        }

        .staff-tabs .ant-tabs-tab-active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
          color: white !important;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3) !important;
        }
        
        .staff-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white !important;
        }
        
        .staff-tabs .ant-tabs-tab-active .anticon {
          color: white !important;
        }
        
        .staff-tabs .ant-tabs-content-holder {
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

export default AuctionDetailAnonymous;
