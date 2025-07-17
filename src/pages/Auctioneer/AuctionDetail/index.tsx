import { useLocation } from "react-router-dom";
import AuctionServices from "../../../services/AuctionServices";
import { useEffect, useState } from "react";
import type { AuctionDataDetail, AuctionDateModal, AuctionRoundPrice } from "../Modals";
import { useAppRouting } from "../../../hooks/useAppRouting";
import AuctionDetail from "./components/AuctionDetail";
import { Tabs } from "antd";
import ListAuctionDocument from "./components/ListAuctionDocument";
import InputAuctionPrice from "./components/InputAuctionPrice";
import AuctioneerCreateAuctionRound from "./components/AuctioneerCreateAuctionRound";
import { TrophyOutlined, TeamOutlined, DollarOutlined, FileTextOutlined } from "@ant-design/icons";

const auctionRoundPriceFakeData: AuctionRoundPrice[] = [
  {
    AuctionRoundId: "AR001",
    UserName: "Nguyễn Văn An",
    CitizenIdentification: "123456789012",
    RecentLocation: "Quận 1, TP.HCM",
    TagName: "Nhà phố 3 tầng",
    AuctionPrice: "5000000000",
  },
  {
    AuctionRoundId: "AR002",
    UserName: "Trần Thị Bình",
    CitizenIdentification: "987654321098",
    RecentLocation: "Cầu Giấy, Hà Nội",
    TagName: "Ô tô Mercedes C200",
    AuctionPrice: "1200000000",
  },
  {
    AuctionRoundId: "AR003",
    UserName: "Lê Hoàng Minh",
    CitizenIdentification: "456789123456",
    RecentLocation: "TP. Đà Nẵng",
    TagName: "Đất nền 100m2",
    AuctionPrice: "3000000000",
  },
  {
    AuctionRoundId: "AR004",
    UserName: "Phạm Thị Hồng",
    CitizenIdentification: "321654987123",
    RecentLocation: "Bình Thạnh, TP.HCM",
    TagName: "Căn hộ chung cư 80m2",
    AuctionPrice: "2500000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
  {
    AuctionRoundId: "AR005",
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "789123456789",
    RecentLocation: "Hai Bà Trưng, Hà Nội",
    TagName: "Xe máy SH 150i",
    AuctionPrice: "150000000",
  },
];

const AuctionDetailAuctioneer = () => {
  const location = useLocation();
  const [auctionDetailData, setAuctionDetailData] = useState<AuctionDataDetail>();
  const { role } = useAppRouting();
  const [isOpentPopupVerifyCancel, setIsOpenPopupVerifyCancel] = useState<boolean>(false);
  const [auctionDateModal, setAuctionDateModal] = useState<AuctionDateModal>();
  const [listAuctionRoundPice] = useState<AuctionRoundPrice[]>(auctionRoundPriceFakeData);

  useEffect(() => {
    console.log("role: ", role);
    getAuctionDetailById(location.state.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(isOpentPopupVerifyCancel);

  const getAuctionDetailById = async (auctionId: string) => {
    try {
      const response = await AuctionServices.getAuctionDetail(auctionId);
      console.log(response.data);
      const auctionDate: AuctionDateModal = {
        auctionEndDate: response.data?.auctionEndDate,
        auctionStartDate: response.data?.auctionStartDate,
        registerOpenDate: response.data?.registerOpenDate,
        registerEndDate: response.data?.registerEndDate,
      };
      setAuctionDateModal(auctionDate);
      setAuctionDetailData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="p-4 sm:p-6 h-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full animate-float delay-3000"></div>
      </div>

      <div className="w-full mx-auto rounded-xl h-full relative z-10">
        <Tabs
          defaultActiveKey="1"
          className="w-full h-full auction-tabs"
          tabBarStyle={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
          }}
          items={[
            {
              key: "1",
              label: (
                <div className="flex items-center gap-2 px-4 py-2">
                  <FileTextOutlined className="text-blue-600" />
                  <span className="font-semibold text-gray-700">Thông tin đấu giá</span>
                </div>
              ),
              children: (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 min-h-[500px]">
                  <AuctionDetail
                    auctionDetailData={auctionDetailData}
                    setIsOpenPopupVerifyCancel={setIsOpenPopupVerifyCancel}
                  />
                </div>
              ),
            },
            {
              key: "2",
              label: (
                <div className="flex items-center gap-2 px-4 py-2">
                  <TeamOutlined className="text-teal-600" />
                  <span className="font-semibold text-gray-700">Danh sách tham gia đấu giá</span>
                </div>
              ),
              children: (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 min-h-[500px]">
                  <ListAuctionDocument
                    auctionId={location.state.key}
                    auctionDateModals={auctionDateModal}
                  />
                </div>
              ),
            },
            {
              key: "3",
              label:
                role === "Auctioneer" ? (
                  <div className="flex items-center gap-2 px-4 py-2">
                    <TrophyOutlined className="text-purple-600" />
                    <span className="font-semibold text-gray-700">Tạo vòng đấu giá</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2">
                    <DollarOutlined className="text-green-600" />
                    <span className="font-semibold text-gray-700">Nhập giá</span>
                  </div>
                ),
              children: (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 min-h-[500px]">
                  {role === "Auctioneer" ? (
                    <AuctioneerCreateAuctionRound auctionRoundPrices={listAuctionRoundPice} />
                  ) : (
                    <InputAuctionPrice auctionId={location.state.key} />
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      <style>{`
        .auction-tabs .ant-tabs-tab {
          border-radius: 12px !important;
          transition: all 0.3s ease !important;
          margin: 0 4px !important;
        }
        
        .auction-tabs .ant-tabs-tab:hover {
          background: rgba(59, 130, 246, 0.1) !important;
          transform: translateY(-2px) !important;
        }
        
        .auction-tabs .ant-tabs-tab-active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
          color: white !important;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3) !important;
        }
        
        .auction-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white !important;
        }
        
        .auction-tabs .ant-tabs-tab-active .anticon {
          color: white !important;
        }
        
        .auction-tabs .ant-tabs-content-holder {
          background: transparent !important;
        }
        
        .auction-tabs .ant-tabs-tabpane {
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

export default AuctionDetailAuctioneer;
