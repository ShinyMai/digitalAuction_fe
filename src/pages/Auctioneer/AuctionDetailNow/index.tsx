/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation } from "react-router-dom";
import AuctionServices from "../../../services/AuctionServices";
import { useEffect, useState } from "react";
import type {
  AuctionDataDetail,
  AuctionDateModal,
  AuctionRoundModals,
} from "../Modals";
import AuctionDetail from "./components/AuctionDetail";
import { Tabs } from "antd";
import ListAuctionDocument from "./components/ListAuctionDocument";
import { TeamOutlined, FileTextOutlined } from "@ant-design/icons";
import "./styles.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import AuctionRounds from "../AuctionRounds";
import { toast } from "react-toastify";

// Thêm interface cho auction asset
interface AuctionAsset {
  auctionAssetsId: string;
  tagName: string;
  startingPrice?: number;
}

const USER_ROLES = {
  USER: "Customer",
  ADMIN: "Admin",
  STAFF: "Staff",
  AUCTIONEER: "Auctioneer",
  MANAGER: "Manager",
  DIRECTOR: "Director",
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

const AuctionDetailAuctioneer = () => {
  const location = useLocation();
  const [auctionDetailData, setAuctionDetailData] =
    useState<AuctionDataDetail>();
  const [auctionDateModal, setAuctionDateModal] = useState<AuctionDateModal>();
  const [auctionAssets, setAuctionAssets] = useState<AuctionAsset[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.roleName as UserRole | undefined;
  const [auctionRounds, setAuctionRounds] = useState<AuctionRoundModals[]>([]);
  const [isHaveAucationRound, setIsHaveAuctionRound] = useState(false);
  useEffect(() => {
    getAuctionDetailById(location.state.key);
    onGetListAuctionRound(location.state.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuctionDetailById = async (auctionId: string) => {
    try {
      const response = await AuctionServices.getAuctionDetail(auctionId);
      const auctionDate: AuctionDateModal = {
        auctionEndDate: response.data?.auctionEndDate,
        auctionStartDate: response.data?.auctionStartDate,
        registerOpenDate: response.data?.registerOpenDate,
        registerEndDate: response.data?.registerEndDate,
      };

      // Xử lý và set auction assets từ response data
      if (
        response.data?.listAuctionAssets &&
        Array.isArray(response.data.listAuctionAssets)
      ) {
        const assets: AuctionAsset[] = response.data.listAuctionAssets.map(
          (asset: any) => ({
            auctionAssetsId: asset.auctionAssetsId,
            tagName: asset.tagName,
          })
        );
        setAuctionAssets(assets);
      }

      setAuctionDateModal(auctionDate);
      setAuctionDetailData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onGetListAuctionRound = async (auctionId: string) => {
    // Logic to get list of auction rounds
    try {
      const response = await AuctionServices.getListAuctionRounds(auctionId);
      setAuctionRounds(response.data.auctionRounds);
      setIsHaveAuctionRound(true);
    } catch (error) {
      console.error("Error fetching auction rounds:", error);
    }
  };

  const onCreateAuctionRound = async () => {
    // Logic to create a new auction round
    try {
      const dataRequest = {
        auctionId: location.state.key,
        createdBy: user?.id,
      };
      const response = await AuctionServices.createAuctionRound(dataRequest);
      toast.success(response.data);
      onGetListAuctionRound(location.state.key);
    } catch (error) {
      console.error("Error creating auction round:", error);
      toast.error("Error creating auction round");
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
          className="w-full h-full auction-tabs-modern"
          tabBarGutter={8}
          centered={false}
          tabPosition="top"
          items={[
            {
              key: "1",
              label: (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:scale-105 hover:shadow-md">
                  <FileTextOutlined className="text-blue-600 text-lg transition-colors duration-300" />
                  <span className="font-semibold text-gray-700 transition-colors duration-300">
                    Thông tin đấu giá
                  </span>
                </div>
              ),
              children: (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 min-h-[500px] transition-all duration-300 hover:shadow-2xl">
                  <AuctionDetail
                    auctionDetailData={auctionDetailData}
                    onCreateAuctionRound={onCreateAuctionRound}
                    isHaveAuctionRound={isHaveAucationRound}
                  />
                </div>
              ),
            },
            {
              key: "2",
              label: (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-teal-50 hover:scale-105 hover:shadow-md">
                  <TeamOutlined className="text-teal-600 text-lg transition-colors duration-300" />
                  <span className="font-semibold text-gray-700 transition-colors duration-300">
                    Danh sách tham gia đấu giá
                  </span>
                </div>
              ),
              children: (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 min-h-[500px] transition-all duration-300 hover:shadow-2xl">
                  <ListAuctionDocument
                    auctionId={location.state.key}
                    auctionDateModals={auctionDateModal}
                    auctionAssets={auctionAssets}
                  />
                </div>
              ),
            },
            ...(auctionRounds.length > 0
              ? [
                {
                  key: "3",
                  label: (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-purple-50 hover:scale-105 hover:shadow-md">
                      <TeamOutlined className="text-purple-600 text-lg transition-colors duration-300" />
                      <span className="font-semibold text-gray-700 transition-colors duration-300">
                        {role == USER_ROLES.AUCTIONEER
                          ? "Quản lý phiên đấu giá"
                          : role == USER_ROLES.STAFF
                            ? "Tham gia phiên đấu giá"
                            : "Theo dõi phiên đấu giá"}
                      </span>
                    </div>
                  ),
                  children: (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 min-h-[500px] transition-all duration-300 hover:shadow-2xl">
                      <AuctionRounds
                        auctionId={location.state.key}
                        auction={auctionDetailData}
                        auctionAsset={auctionAssets}
                      />
                    </div>
                  ),
                },
              ]
              : []),
          ]}
        />
      </div>
    </section>
  );
};

export default AuctionDetailAuctioneer;
