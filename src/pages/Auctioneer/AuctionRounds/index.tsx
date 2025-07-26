import { useEffect, useState } from "react";
import type { AuctionRound, AuctionRoundPrice } from "./modalsData";
import { fakeAuctionRounds, fakeAuctionRoundPrices } from "./fakeData";
import { calculateStatistics, formatCurrency } from "./utils";
import PageHeader from "./components/PageHeader";
import StatisticsCards from "./components/StatisticsCards";
import AuctionRoundsTable from "./components/AuctionRoundsTable";
import { useNavigate } from "react-router-dom";
import { AUCTIONEER_ROUTES } from "../../../routers";

const AuctionRounds = () => {
    const [auctionRounds, setAuctionRounds] = useState<AuctionRound[]>([]);
    const [auctionRoundPrices, setAuctionRoundPrices] = useState<AuctionRoundPrice[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        getListAuctionRounds();
        getAuctionRoundPrices();
    }, []);

    const getListAuctionRounds = () => {
        try {
            setLoading(true);
            // Simulate fetching data from an API
            setTimeout(() => {
                setAuctionRounds(fakeAuctionRounds);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error("Error fetching auction rounds:", error);
            setLoading(false);
        }
    };

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
        navigate(AUCTIONEER_ROUTES.SUB.AUCTION_ROUND_DETAIL);
    };

    // Calculate statistics
    const stats = calculateStatistics(auctionRounds, auctionRoundPrices);

    return (
        <div className="!min-h-screen !bg-gray-50 !p-6">
            <div className="!max-w-7xl !mx-auto">
                {/* Header */}
                <PageHeader onCreateClick={handleCreateRound} />

                {/* Statistics Cards */}
                <StatisticsCards stats={stats} formatCurrency={formatCurrency} />

                {/* Table */}
                <AuctionRoundsTable
                    auctionRounds={auctionRounds}
                    loading={loading}
                    onViewDetails={handleViewDetails}
                />
            </div>
        </div>
    );
};

export default AuctionRounds;
