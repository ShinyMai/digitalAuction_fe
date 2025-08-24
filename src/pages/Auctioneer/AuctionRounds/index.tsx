import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AuctionRound, AuctionRoundPriceWinner } from "./modalsData";
import PageHeader from "./components/PageHeader";
import StatisticsCards from "./components/StatisticsCards";
import AuctionRoundsTable from "./components/AuctionRoundsTable";
import AuctionResults from "./components/AuctionResults";
import AuctionRoundDetail from "../AuctionRoundDetail";
import AuctionServices from "../../../services/AuctionServices";
import InputAuctionPrice from "../AuctionDetailNow/components/InputAuctionPrice";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { toast } from "react-toastify";
import type { AuctionDataDetail } from "../Modals";
import { useNavigate } from "react-router-dom";
import { STAFF_ROUTES } from "../../../routers";

interface AuctionAsset {
  auctionAssetsId: string;
  tagName: string;
  startingPrice?: number;
}

interface props {
  auctionId: string;
  auction?: AuctionDataDetail;
  auctionAsset: AuctionAsset[];
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

// Utility functions
const formatCurrency = (value: string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(parseInt(value));
};

const AuctionRounds = ({ auctionId, auction, auctionAsset }: props) => {
  const [auctionRounds, setAuctionRounds] = useState<AuctionRound[]>([]);
  const [auctionRoundPriceWinners, setAuctionRoundPriceWinners] = useState<
    AuctionRoundPriceWinner[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showInputPrice, setShowInputPrice] = useState(false);
  const [selectedRound, setSelectedRound] = useState<AuctionRound>();
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.roleName as UserRole | undefined;
  const [roundStatistic, setRoundStatistic] = useState<{
    totalAssets: number;
    totalBids: number;
    totalParticipants: number;
  }>();
  const navigate = useNavigate()

  const getListAuctionRounds = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate fetching data from an API
      const response = await AuctionServices.getListAuctionRounds(auctionId);
      setAuctionRounds(response.data.auctionRounds);
    } catch (error) {
      console.error("Error fetching auction rounds:", error);
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  const getAuctionStatistic = async () => {
    try {
      if (!auctionId) {
        console.error("No auction detail data available");
        return;
      }
      const response = await AuctionServices.auctionRoundStatistic(auctionId);
      setRoundStatistic(response.data);
    } catch (error) {
      console.error("Error fetching auction statistic:", error);
    }
  };

  useEffect(() => {
    getAuctionStatistic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getListAuctionRoundPriceWinners = useCallback(async () => {
    try {
      setLoading(true);
      if (auction?.status == 2) {
        const response =
          await AuctionServices.getListAuctionRoundPriceWinnerByAuctionId(
            auctionId
          );
        if (response.code === 200) {
          // Bổ sung assetId và thông tin thống kê cho mỗi element từ API response
          const enrichedData = await Promise.all(
            response.data.auctionRoundPrices.map(
              async (item: AuctionRoundPriceWinner) => {
                // Tìm assetId dựa vào tagName
                const matchedAsset = auctionAsset.find(
                  (asset) => asset.tagName === item.tagName
                );

                let enrichedItem = { ...item };

                if (matchedAsset) {
                  // Gọi getAuctionAssetStatistic để lấy thêm thông tin
                  try {
                    const assetStatResponse =
                      await AuctionServices.getAssetInfoStatistic(
                        matchedAsset.auctionAssetsId
                      );
                    if (assetStatResponse.code === 200) {
                      // Bổ sung dữ liệu từ asset statistic vào enrichedItem
                      enrichedItem = {
                        ...enrichedItem,
                        assetStatistic: assetStatResponse.data, // Lưu thông tin statistic vào property assetStatistic
                      };
                    }
                  } catch (error) {
                    console.error(
                      `Error fetching asset statistic for ${matchedAsset.auctionAssetsId}:`,
                      error
                    );
                  }
                }

                return enrichedItem;
              }
            )
          );

          // Tạo Set chứa tagName của các tài sản đã có trong response
          const existingTagNames = new Set(
            response.data.auctionRoundPrices.map(
              (item: AuctionRoundPriceWinner) => item.tagName
            )
          );

          // Tìm các tài sản trong auctionAsset nhưng không có trong response
          const missingAssets = auctionAsset.filter(
            (asset) => !existingTagNames.has(asset.tagName)
          );

          // Tạo các entry cho tài sản thiếu với dữ liệu rỗng
          const missingAssetsData = await Promise.all(
            missingAssets.map(async (asset) => {
              let assetStatistic = null;

              // Vẫn gọi API để lấy thông tin thống kê cho tài sản thiếu
              try {
                const assetStatResponse =
                  await AuctionServices.getAssetInfoStatistic(
                    asset.auctionAssetsId
                  );
                if (assetStatResponse.code === 200) {
                  assetStatistic = assetStatResponse.data;
                }
              } catch (error) {
                console.error(
                  `Error fetching asset statistic for missing asset ${asset.auctionAssetsId}:`,
                  error
                );
              }

              return {
                auctionRoundPriceId: asset.auctionAssetsId,
                auctionRound: {
                  auctionRoundId: "",
                  auctionId: auctionId,
                  roundNumber: 0,
                  status: 0,
                  createdAt: "",
                  createdBy: "",
                },
                userName: "",
                citizenIdentification: "",
                recentLocation: "",
                tagName: asset.tagName,
                auctionPrice: 0,
                createdAt: "",
                createdBy: "",
                flagWinner: false,
                assetStatistic: assetStatistic,
              } as AuctionRoundPriceWinner;
            })
          );
          console.log("Asset no data", missingAssetsData);
          // Kết hợp dữ liệu từ API và tài sản thiếu
          const completeData = [...enrichedData, ...missingAssetsData];

          setAuctionRoundPriceWinners(completeData);
          console.log("Complete auction round price winners:", completeData);
        }
      }
    } catch (error) {
      console.error("Error fetching auction round price winners:", error);
    } finally {
      setLoading(false);
    }
  }, [auctionId, auction?.status, auctionAsset]);

  const handleCreateRound = useCallback(async () => {
    try {
      if (!auctionId) {
        console.error("No auction detail data available");
        return;
      }

      // Kiểm tra xem có vòng đấu giá nào đang diễn ra không (status = 1)
      const activeRounds = auctionRounds.filter(round => round.status === 1);

      if (activeRounds.length > 0) {
        toast.warning(
          `Không thể tạo vòng đấu giá mới. Hiện có ${activeRounds.length} vòng đấu giá đang diễn ra. Vui lòng kết thúc tất cả các vòng đấu giá hiện tại trước khi tạo vòng mới.`
        );
        return;
      }

      // Kiểm tra giới hạn số vòng đấu giá
      if (
        auction?.numberRoundMax &&
        auctionRounds.length >= auction.numberRoundMax
      ) {
        toast.warning(
          `Số lượng vòng đấu giá đã đạt giới hạn tối đa (${auction.numberRoundMax} vòng)`
        );
        return;
      }

      const dataRequest = {
        auctionId: auctionId,
        createdBy: user?.id,
      };
      const response = await AuctionServices.createAuctionRound(dataRequest);

      // ✅ Cập nhật lại danh sách auction rounds sau khi tạo thành công
      if (response.code === 200) {
        await getListAuctionRounds();
        toast.success("Vòng đấu giá mới đã được tạo");
      } else {
        toast.error("Lỗi khi tạo danh vòng đấu giá");
      }
    } catch (error) {
      console.error("Error creating auction round:", error);
      toast.error("Error creating auction round");
    }
  }, [
    auctionId,
    user?.id,
    getListAuctionRounds,
    auction?.numberRoundMax,
    auctionRounds,
  ]);

  useEffect(() => {
    getListAuctionRounds();
    getListAuctionRoundPriceWinners();
  }, [getListAuctionRounds, getListAuctionRoundPriceWinners]);

  const handleEndAuction = async () => {
    try {
      // Kiểm tra xem có vòng đấu giá nào đang diễn ra không (status = 1)
      const activeRounds = auctionRounds.filter(round => round.status === 1);

      if (activeRounds.length > 0) {
        toast.warning(
          `Không thể kết thúc phiên đấu giá. Hiện có ${activeRounds.length} vòng đấu giá đang diễn ra. Vui lòng kết thúc tất cả các vòng đấu giá trước khi kết thúc phiên.`
        );
        return;
      }

      const response = await AuctionServices.updateAuctionSuccessfull({
        auctionId: auctionId,
      });
      if (response.code === 200) {
        toast.success("Phiên đấu giá đã kết thúc thành công");
        navigate(`${role?.toLocaleLowerCase()}/${STAFF_ROUTES.SUB.AUCTION_LIST_SUCCESSFULL}`)
      } else {
        toast.error("Lỗi khi kết thúc phiên đấu giá");
      }
    } catch (error) {
      console.error("Error ending auction:", error);
      toast.error("Error ending auction");
    }
  };

  const handleViewResults = () => {
    setShowResults(true);
  };

  const handleViewDetails = (record: AuctionRound) => {
    setSelectedRound(record);
    setShowDetail(true);
    setShowInputPrice(false);
  };

  const handleInputPrice = (record: AuctionRound) => {
    setSelectedRound(record);
    setShowInputPrice(true);
    setShowDetail(false);
  };

  // Tìm auctionRoundId của vòng liền trước
  const getPreviousRoundId = (currentRound: AuctionRound | undefined) => {
    if (!currentRound || !auctionRounds.length) return undefined;

    // Sắp xếp các vòng theo roundNumber tăng dần
    const sortedRounds = [...auctionRounds].sort(
      (a, b) => a.roundNumber - b.roundNumber
    );

    // Tìm index của vòng hiện tại
    const currentIndex = sortedRounds.findIndex(
      (round) => round.auctionRoundId === currentRound.auctionRoundId
    );

    // Nếu có vòng trước đó, trả về auctionRoundId của vòng đó
    if (currentIndex > 0) {
      return sortedRounds[currentIndex - 1].auctionRoundId;
    }

    return undefined;
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setShowResults(false);
    setShowInputPrice(false);
    setSelectedRound(undefined);
    // Gọi lại getListAuctionRounds để cập nhật dữ liệu
    getListAuctionRounds();
  };

  return (
    <div className="!min-h-fit relative overflow-hidden bg-white rounded-2xl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full animate-float delay-3000"></div>
      </div>

      <div className="w-full !mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!showDetail && !showResults && !showInputPrice ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <PageHeader
                  auction={auction}
                  onCreateClick={handleCreateRound}
                  onEndAuction={handleEndAuction}
                  onViewResults={handleViewResults}
                />
              </motion.div>

              {/* Statistics Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <StatisticsCards
                  stats={roundStatistic}
                  formatCurrency={formatCurrency}
                />
              </motion.div>

              {/* Table */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <AuctionRoundsTable
                  auctionRounds={auctionRounds}
                  loading={loading}
                  auction={auction}
                  userRole={role}
                  onViewDetails={handleViewDetails}
                  onInputPrice={handleInputPrice}
                />
              </motion.div>
            </motion.div>
          ) : showResults ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <AuctionResults
                auctionID={auctionId}
                auctionRoundPriceWinners={auctionRoundPriceWinners}
                onBack={handleBackToList}
              />
            </motion.div>
          ) : showDetail ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {role === USER_ROLES.AUCTIONEER && (
                <AuctionRoundDetail
                  auctionRound={selectedRound}
                  auction={auction}
                  onBackToList={handleBackToList}
                />
              )}
              {role === USER_ROLES.STAFF && (
                <AuctionRoundDetail
                  auctionRound={selectedRound}
                  auction={auction}
                  onBackToList={handleBackToList}
                />
              )}
            </motion.div>
          ) : showInputPrice ? (
            <motion.div
              key="input-price"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <InputAuctionPrice
                auctionId={auctionId}
                roundData={selectedRound}
                auctionRoundIdBefore={getPreviousRoundId(selectedRound)}
                onBackToList={handleBackToList}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
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
    </div>
  );
};

export default AuctionRounds;
