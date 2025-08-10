import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
import AuctionAssetServices from "../../../services/AuctionAssetServices";
import {
  AssetHeader,
  AssetBasicInfo,
  AssetFinancialInfo,
  AssetDescription,
  AssetStatistics,
  LoadingSpinner,
  EmptyState,
  CustomStyles,
} from "./components";

interface AuctionAssetResponse {
  auctionAssetsId: string;
  tagName: string;
  startingPrice: number;
  unit: string;
  deposit: number;
  registrationFee: number;
  description: string;
  createdAt: string;
  auctionName: string;
}

interface DetailResponse {
  code: number;
  message: string;
  data: {
    auctionAssetResponse: AuctionAssetResponse;
    totalAuctionDocument: number;
    totalRegistrationFee: number;
    totalDeposit: number;
  };
}

const DetailAuctionAsset = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assetData, setAssetData] = useState<DetailResponse["data"] | null>(
    null
  );

  // Fetch data based on the ID from URL params
  useEffect(() => {
    if (id) {
      fetchAssetDetail(id);
    }
  }, [id]);

  const fetchAssetDetail = async (assetId: string) => {
    try {
      setLoading(true);
      const uppercaseId = assetId.toUpperCase();
      const response = await AuctionAssetServices.getDetailAuctionAsset(
        uppercaseId
      );

      if (response.code === 200 && response.data) {
        setAssetData(response.data as DetailResponse["data"]);
      } else {
        console.error("Failed to fetch asset detail:", response.message);
      }
    } catch (error) {
      console.error("Error fetching asset detail:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!assetData) {
    return <EmptyState />;
  }

  const {
    auctionAssetResponse,
    totalAuctionDocument,
    totalRegistrationFee,
    totalDeposit,
  } = assetData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-40 right-32 w-32 h-32 bg-purple-200/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-28 h-28 bg-indigo-200/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <AssetHeader
          auctionAssetResponse={auctionAssetResponse}
          onGoBack={() => navigate(-1)}
        />

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="!space-y-6">
              <AssetBasicInfo auctionAssetResponse={auctionAssetResponse} />

              <AssetFinancialInfo auctionAssetResponse={auctionAssetResponse} />

              <AssetDescription
                description={auctionAssetResponse.description}
              />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div className="!space-y-6 sticky top-6">
              <AssetStatistics
                totalAuctionDocument={totalAuctionDocument}
                totalRegistrationFee={totalRegistrationFee}
                totalDeposit={totalDeposit}
                deposit={auctionAssetResponse.deposit}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Custom Styles */}
      <CustomStyles />
    </div>
  );
};

export default DetailAuctionAsset;
