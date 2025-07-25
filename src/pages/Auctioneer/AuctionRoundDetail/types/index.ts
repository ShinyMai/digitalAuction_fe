import type { AuctionRound, AuctionRoundPrice } from '../../ModalsDatabase';

export interface AuctionRoundDetailProps {
  roundId: string;
}

export interface RoundDetailStats {
  totalBids: number;
  uniqueBidders: number;
  highestBid: number;
  lowestBid: number;
  averageBid: number;
  bidIncrement: number;
  timeRange: {
    firstBid: string;
    lastBid: string;
  };
  topBidderLocation: string;
}

export interface ExtendedAuctionRoundPrice extends AuctionRoundPrice {
  rank?: number;
  timeFromStart?: string;
  isWinning?: boolean;
}

export interface BidderInfo {
  userName: string;
  citizenId: string;
  location: string;
  totalBids: number;
  highestBid: number;
  averageBid: number;
  bidTimes: string[];
}

export interface RoundDetailData {
  round: AuctionRound;
  prices: ExtendedAuctionRoundPrice[];
  stats: RoundDetailStats;
  topBidders: BidderInfo[];
  winningBids: ExtendedAuctionRoundPrice[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  type: 'bid' | 'milestone';
  user?: string;
  amount?: number;
  description: string;
  icon?: React.ReactNode;
}
