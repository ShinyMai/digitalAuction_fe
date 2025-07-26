export type AuctionRoundPrice = {
  AuctionRoundId: string;
  UserName: string;
  CitizenIdentification: string;
  RecentLocation: string;
  TagName: string;
  AuctionPrice: string;
  FlagWinner?: number // 0: Not Winner, 1: Winner
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