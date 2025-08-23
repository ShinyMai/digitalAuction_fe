import { useEffect, useState } from "react";
import { Tabs, Button, Typography } from "antd";
import {
  ReloadOutlined,
  HistoryOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import type { AuctionRound, AuctionRoundPrice } from "./modalsData";
import AuctionHeader from "./components/AuctionHeader";
import PriceHistoryTable from "./components/PriceHistoryTable";
import AssetAnalysisTable from "./components/AssetAnalysisTable";
import "./styles.css";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
import type { AuctionDataDetail } from "../Modals";

interface AuctionRoundDetailProps {
  auctionRound?: AuctionRound;
  auction?: AuctionDataDetail;
  onBackToList?: () => void;
}

const AuctionRoundDetail = ({
  auctionRound,
  onBackToList,
  auction,
}: AuctionRoundDetailProps) => {

  const [auctionRoundPrice, setAuctionRoundPrice] = useState<
    AuctionRoundPrice[]
  >([]);
  const [activeTab, setActiveTab] = useState<string>("history");
  const [loading, setLoading] = useState<boolean>(false);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await getListOfAuctionRoundPrices();
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await loadAllData();
    };
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionRound]);

  const getListOfAuctionRoundPrices = async () => {
    try {
      if (auctionRound) {
        const response = await AuctionServices.getListAuctionRoundPrices(
          auctionRound?.auctionRoundId
        );
        setAuctionRoundPrice(response.data.listAuctionRoundPrices);
        console.log(
          "Using real API data for auction round prices:",
          auctionRound?.auctionRoundId
        );
      }
    } catch (error) {
      console.error("Error fetching auction round prices:", error);
    }
  };

  // API Function 5: Update winner flag (existing)
  const onUpdateWinnerFlag = async (
    auctionRoundPriceId: string,
    userName: string,
    assetName: string
  ) => {
    try {
      const response = await AuctionServices.updateWinnerFlag({
        auctionRoundPriceId: auctionRoundPriceId,
      });
      if (response.data.statusUpdate) {
        toast.success(
          `Đã cập nhật ${userName} là người chiến thắng cho tài sản ${assetName}`
        );
        // Refresh price history after update
        await getListOfAuctionRoundPrices();
      } else {
        toast.error(
          `Cập nhật người chiến thắng thất bại: ${response.data.message}`
        );
      }
    } catch (error) {
      console.error("Error updating winner flag:", error);
      toast.error("Có lỗi xảy ra khi cập nhật người chiến thắng");
    }
  };

  // API Function 6: End auction (MISSING API) Chưa test
  const endAuction = async () => {
    try {
      const response = await AuctionServices.updateStatusAuctionRound({
        auctionRoundId: auctionRound?.auctionRoundId,
        status: 2,
      });
      if (response.data) {
        toast.success("Phiên đấu giá đã được kết thúc");
        //await loadAllData(); // Refresh data
      } else {
        toast.error("Kết thúc phiên đấu giá thất bại");
      }
    } catch (error) {
      console.error("Error ending auction:", error);
      toast.error("Có lỗi xảy ra khi kết thúc phiên đấu giá");
      throw error;
    }
  };

  // Refresh all data function
  const refreshAllData = async () => {
    await loadAllData();
    toast.success("Dữ liệu đã được làm mới");
  };

  // Calculate basic stats from current data
  const totalParticipants = new Set(
    auctionRoundPrice.map((item) => item.citizenIdentification)
  ).size;
  const totalAssets = new Set(auctionRoundPrice.map((item) => item.tagName))
    .size;

  const tabItems = [
    {
      key: "history",
      label: (
        <span className="flex items-center gap-2">
          <HistoryOutlined />
          Lịch sử trả giá
        </span>
      ),
      children: <PriceHistoryTable priceHistory={auctionRoundPrice} />,
    },
    {
      key: "assets",
      label: (
        <span className="flex items-center gap-2">
          <HomeOutlined />
          Phân tích tài sản
        </span>
      ),
      children: (
        <AssetAnalysisTable
          auctionRound={auctionRound}
          priceHistory={auctionRoundPrice}
          onUpdateWinner={onUpdateWinnerFlag}
        />
      ),
    },
  ];

  return (
    <div className="min-h-fit bg-gray-50 p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        {onBackToList && (
          <div className="mb-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onBackToList}
              className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="large"
            >
              Quay lại danh sách
            </Button>
          </div>
        )}

        {/* Header */}
        <AuctionHeader
          auctionRoundId={auctionRound?.auctionRoundId}
          auctionName={auction?.auctionName || "Phiên đấu giá"}
          totalParticipants={totalParticipants}
          totalAssets={totalAssets}
          status={auctionRound?.status}
          onEndAuction={endAuction}
        />

        {/* Tabs with Ant Design */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <Typography.Title level={4} className="m-0">
              Quản lý phiên đấu giá
            </Typography.Title>
            {auctionRound?.status !== 2 && (
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={refreshAllData}
                className="flex items-center"
                loading={loading}
              >
                Làm mới dữ liệu
              </Button>
            )}
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
            className="custom-tabs"
          />
        </div>
      </div>
    </div>
  );
};

export default AuctionRoundDetail;
