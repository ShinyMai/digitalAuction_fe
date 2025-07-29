import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AuctionRound, AuctionRoundPrice, AuctionRoundPriceWinner } from "./modalsData";
import { fakeAuctionRoundPrices } from "./fakeData";
import PageHeader from "./components/PageHeader";
import StatisticsCards from "./components/StatisticsCards";
import AuctionRoundsTable from "./components/AuctionRoundsTable";
import AuctionResults from "./components/AuctionResults";
import AuctionRoundDetail from "../AuctionRoundDetail";
import AuctionServices from "../../../services/AuctionServices";
import InputAuctionPrice from "../AuctionDetail/components/InputAuctionPrice";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { toast } from "react-toastify";
import type { AuctionDataDetail } from "../Modals";

interface AuctionAsset {
    auctionAssetsId: string;
    tagName: string;
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

type UserRole =
    (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Utility functions
const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(parseInt(value));
};

const calculateStatistics = (
    auctionRounds: AuctionRound[],
    auctionRoundPrices: AuctionRoundPrice[]
) => {
    const totalRounds = auctionRounds.length;
    const activeRounds = auctionRounds.filter(round => round.status === 1).length;
    const completedRounds = auctionRounds.filter(round => round.status === 2).length;

    const totalBids = auctionRoundPrices.length;
    const totalBidders = new Set(auctionRoundPrices.map(price => price.CitizenIdentification)).size;

    const totalBidValue = auctionRoundPrices.reduce((sum, price) => sum + parseInt(price.AuctionPrice), 0);
    const averageBidValue = totalBids > 0 ? totalBidValue / totalBids : 0;

    return {
        totalRounds,
        activeRounds,
        completedRounds,
        totalBids,
        totalBidders,
        totalBidValue,
        averageBidValue
    };
};

const AuctionRounds = ({ auctionId, auctionAsset, auction }: props) => {
    const [auctionRounds, setAuctionRounds] = useState<AuctionRound[]>([]);
    const [auctionRoundPrices, setAuctionRoundPrices] = useState<AuctionRoundPrice[]>([]);
    const [auctionRoundPriceWinners, setAuctionRoundPriceWinners] = useState<AuctionRoundPriceWinner[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedRound, setSelectedRound] = useState<AuctionRound>();
    const { user } = useSelector(
        (state: RootState) => state.auth
    );
    const role = user?.roleName as UserRole | undefined;

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

    const getAuctionRoundPrices = useCallback(() => {
        try {
            setAuctionRoundPrices(fakeAuctionRoundPrices);
        } catch (error) {
            console.error("Error fetching auction round prices:", error);
        }
    }, []);

    const getListAuctionRoundPriceWinners = useCallback(async () => {
        try {
            setLoading(true);
            if (auction?.status == 2) {
                const response = await AuctionServices.getListAuctionRoundPriceWinnerByAuctionId(auctionId);
                if (response.code === 200) {
                    setAuctionRoundPriceWinners(response.data);
                }
                console.log("Auction round price winners:", response.data);
            }
        } catch (error) {
            console.error("Error fetching auction round price winners:", error);
        } finally {
            setLoading(false);
        }
    }, [auctionId, auction?.status]);

    const handleCreateRound = useCallback(async () => {
        try {
            if (!auctionId) {
                console.error("No auction detail data available");
                return;
            }
            const dataRequest = {
                auctionId: auctionId,
                createdBy: user?.id
            }
            const response = await AuctionServices.createAuctionRound(dataRequest);


            // ✅ Cập nhật lại danh sách auction rounds sau khi tạo thành công
            if (response.code === 200) {
                await getListAuctionRounds();
                toast.success(response.data);
            } else {
                toast.error("Lỗi khi tạo danh vòng đấu giá");
            }


        } catch (error) {
            console.error("Error creating auction round:", error);
            toast.error("Error creating auction round");
        }
    }, [auctionId, user?.id, getListAuctionRounds]);

    useEffect(() => {
        getListAuctionRounds();
        getAuctionRoundPrices();
        getListAuctionRoundPriceWinners();
    }, [getListAuctionRounds, getAuctionRoundPrices, getListAuctionRoundPriceWinners]);



    const handleEndAuction = () => {
        console.log("Creating new auction round...");
    };

    const handleViewResults = () => {
        console.log("Viewing auction results...");
        setShowResults(true);
    };

    const handleViewDetails = (record: AuctionRound) => {
        setSelectedRound(record);
        setShowDetail(true);
    };

    const handleBackToList = () => {
        setShowDetail(false);
        setShowResults(false);
        setSelectedRound(undefined);
    };

    // Calculate statistics
    const stats = calculateStatistics(auctionRounds, auctionRoundPrices);

    return (
        <div className="!min-h-screen !bg-gray-50 !p-6 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full animate-float"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full animate-float delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full animate-float delay-2000"></div>
                <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full animate-float delay-3000"></div>
            </div>

            <div className="!max-w-7xl !mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    {!showDetail && !showResults ? (
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
                                <StatisticsCards stats={stats} formatCurrency={formatCurrency} />
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
                                    onViewDetails={handleViewDetails}
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
                                auctionRoundPriceWinners={auctionRoundPriceWinners}
                                onBack={handleBackToList}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            {
                                role === USER_ROLES.AUCTIONEER && (
                                    <AuctionRoundDetail
                                        auctionRound={selectedRound}
                                        auction={auction}
                                        onBackToList={handleBackToList} />
                                )
                            }
                            {
                                role === USER_ROLES.STAFF && (
                                    <InputAuctionPrice
                                        auctionId={auctionId}
                                        roundData={selectedRound}
                                        auctionAssetsToStatistic={auctionAsset}
                                        onBackToList={handleBackToList}
                                    />
                                )
                            }
                        </motion.div>
                    )}
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
