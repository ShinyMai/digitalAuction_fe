export type AuctionRoundPrice = {
  auctionRoundPriceId: string;
  auctionRoundId: string;
  userName: string;
  citizenIdentification: string;
  recentLocation: string;
  tagName: string;
  auctionPrice: number;
  flagWinner: boolean; // true if this price is the winning price
};

export type AuctionRound = {
    auctionRoundId: string;
    auction: AuctionDataDetail;
    roundNumber: number;
    status: number;
}

export type AuctionDataDetail = {
  auctionId: string;
  auctionName: string;
  categoryName: string;
  auctionDescription: string;
  auctionRules: string;
  auctionPlanningMap: string;
  registerOpenDate: string;
  registerEndDate: string;
  auctionStartDate: string;
  auctionEndDate: string;
  createdByUserName: string;
  createdAt: string;
  updatedByUserName: string;
  updatedAt: string;
  qrLink: string;
  numberRoundMax: number;
  status: string;
  auctionMap?: string;
  winnerData: string;
  auctioneer?: string;
  listAuctionAssets?: AuctionAsset[];
};

export type AuctionAsset = {
  auctionAssetsId: string;
  tagName: string;
  startingPrice: string;
  unit: string;
  deposit: string;
  registrationFee: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  auctionId: string;
  auction?: string;
};

// Data types for different API endpoints
export type AuctionHeaderData = {
  auctionRoundId: string;
  auctionName: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  currentRound: number;
  totalRounds: number;
  totalParticipants: number;
  totalAssets: number;
  totalBids: number;
  highestBid: number;
  progress: number; // percentage 0-100
};

export type AuctionStatisticsData = {
  averageBidAmount: number;
  participationStats: {
    totalParticipants: number;
    activeParticipants: number;
    averageBidsPerParticipant: number;
  };
  priceDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
};

export type AssetAnalysisData = {
  assetId: string;
  tagName: string;
  startingPrice: number;
  currentHighestBid: number;
  winnerInfo?: {
    userName: string;
    citizenIdentification: string;
    finalBid: number;
    isConfirmed: boolean;
  };
  bidHistory: AuctionRoundPrice[];
  participantCount: number;
  priceIncrease: number;
  priceIncreasePercent: number;
};