import type { AuctionRound, AuctionRoundPrice } from "../modalsData";
import type { StatisticsData } from "../components/StatisticsCards";

export const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(parseInt(value));
};

export const calculateStatistics = (
    auctionRounds: AuctionRound[], 
    auctionRoundPrices: AuctionRoundPrice[]
): StatisticsData => {
    const totalRounds = auctionRounds.length;
    const activeRounds = auctionRounds.filter(round => round.status === 1).length;
    const completedRounds = auctionRounds.filter(round => round.status === 2).length;

    const totalBids = auctionRoundPrices.length;
    const totalBidders = new Set(auctionRoundPrices.map(price => price.CitizenIdentification)).size;
    const winners = auctionRoundPrices.filter(price => price.FlagWinner === 1).length;

    const totalBidValue = auctionRoundPrices.reduce((sum, price) => sum + parseInt(price.AuctionPrice), 0);
    const averageBidValue = totalBids > 0 ? totalBidValue / totalBids : 0;

    return {
        totalRounds,
        activeRounds,
        completedRounds,
        totalBids,
        totalBidders,
        winners,
        totalBidValue,
        averageBidValue
    };
};
