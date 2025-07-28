import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AuctionRound, AuctionRoundPrice } from "./modalsData";
import { fakeAuctionRoundPrices } from "./fakeData";
import { calculateStatistics, formatCurrency } from "./utils";
import PageHeader from "./components/PageHeader";
import StatisticsCards from "./components/StatisticsCards";
import AuctionRoundsTable from "./components/AuctionRoundsTable";
import AuctionRoundDetail from "../AuctionRoundDetail";
import AuctionServices from "../../../services/AuctionServices";

interface props {
    auctionId: string;
}

const AuctionRounds = ({ auctionId }: props) => {
    const [auctionRounds, setAuctionRounds] = useState<AuctionRound[]>([]);
    const [auctionRoundPrices, setAuctionRoundPrices] = useState<AuctionRoundPrice[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedRound, setSelectedRound] = useState<AuctionRound>();
    useEffect(() => {
        getListAuctionRounds();
        getAuctionRoundPrices();
    }, []);

    const getListAuctionRounds = async () => {
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
    };

    // const getAuctionRoundPrices = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await AuctionServices.getAuctionRoundPrices();
    //         setAuctionRoundPrices(response.data);
    //     } catch (error) {
    //         console.error("Error fetching auction rounds:", error);
    //         setLoading(false);
    //     }
    // };

    const getAuctionRoundPrices = () => {
        try {
            setAuctionRoundPrices(fakeAuctionRoundPrices);
        } catch (error) {
            console.error("Error fetching auction round prices:", error);
        }
    };

    const handleCreateRound = () => {
        console.log("Creating new auction round...");
    };

    const handleViewDetails = (record: AuctionRound) => {
        console.log("View details for record:", record);
        setSelectedRound(record);
        setShowDetail(true);
    };

    const handleBackToList = () => {
        setShowDetail(false);
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
                    {!showDetail ? (
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
                                <PageHeader onCreateClick={handleCreateRound} />
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
                                    onViewDetails={handleViewDetails}
                                />
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <AuctionRoundDetail
                                auctionRound={selectedRound}
                                onBackToList={handleBackToList} />
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
