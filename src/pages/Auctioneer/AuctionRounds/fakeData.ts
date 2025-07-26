import type { AuctionRound, AuctionDataDetail, AuctionAsset, AuctionRoundPrice } from './modalsData';

// Fake Auction Assets
export const fakeAuctionAssets: AuctionAsset[] = [
  {
    auctionAssetsId: "asset-001",
    tagName: "Lô đất A1",
    startingPrice: "",
    unit: "",
    deposit: "",
    registrationFee: "",
    description: "",
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
    auctionId: "auction-001",
    auction: ""
  },
  {
    auctionAssetsId: "asset-002", 
    tagName: "Lô đất B2",
    startingPrice: "",
    unit: "",
    deposit: "",
    registrationFee: "",
    description: "",
    createdAt: "",
    createdBy: "",
    updatedAt: "", 
    updatedBy: "",
    auctionId: "auction-001",
    auction: ""
  },
  {
    auctionAssetsId: "asset-003",
    tagName: "Lô đất C3", 
    startingPrice: "",
    unit: "",
    deposit: "",
    registrationFee: "",
    description: "",
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "", 
    auctionId: "auction-001",
    auction: ""
  }
];

// Fake Auction Data Detail
export const fakeAuctionDataDetail: AuctionDataDetail[] = [
  {
    auctionId: "auction-001",
    auctionName: "Đấu giá quyền sử dụng đất tại Quận 1, TP.HCM",
    categoryName: "Đất đai",
    auctionDescription: "",
    auctionRules: "",
    auctionPlanningMap: "",
    registerOpenDate: "",
    registerEndDate: "", 
    auctionStartDate: "",
    auctionEndDate: "",
    createdByUserName: "",
    createdAt: "",
    updatedByUserName: "",
    updatedAt: "",
    qrLink: "",
    numberRoundMax: 3,
    status: "",
    auctionMap: "",
    winnerData: "",
    auctioneer: "Lê Văn Cường",
    listAuctionAssets: fakeAuctionAssets.slice(0, 3)
  }
];

// Fake Auction Rounds
export const fakeAuctionRounds: AuctionRound[] = [
  {
    auctionRoundId: "round-001",
    auction: fakeAuctionDataDetail[0],
    roundNumber: 1,
    status: 2 // Completed
  },
  {
    auctionRoundId: "round-002", 
    auction: fakeAuctionDataDetail[0],
    roundNumber: 2,
    status: 1 // In Progress
  },
  {
    auctionRoundId: "round-003",
    auction: fakeAuctionDataDetail[0], 
    roundNumber: 3,
    status: 0 // Not Started
  }
];

// Fake Auction Round Prices
export const fakeAuctionRoundPrices: AuctionRoundPrice[] = [
  {
    AuctionRoundId: "round-001",
    UserName: "Nguyễn Văn Minh",
    CitizenIdentification: "123456789",
    RecentLocation: "TP.HCM", 
    TagName: "Lô đất A1",
    AuctionPrice: "2100000000",
    FlagWinner: 0
  },
  {
    AuctionRoundId: "round-001",
    UserName: "Trần Thị Hoa",
    CitizenIdentification: "987654321",
    RecentLocation: "Hà Nội",
    TagName: "Lô đất A1", 
    AuctionPrice: "2150000000",
    FlagWinner: 1 // Winner
  },
  {
    AuctionRoundId: "round-001",
    UserName: "Lê Văn Tuấn",
    CitizenIdentification: "456789123",
    RecentLocation: "Đà Nẵng",
    TagName: "Lô đất A1",
    AuctionPrice: "2080000000", 
    FlagWinner: 0
  },
  {
    AuctionRoundId: "round-002",
    UserName: "Phạm Thị Lan",
    CitizenIdentification: "789123456",
    RecentLocation: "TP.HCM",
    TagName: "Lô đất B2",
    AuctionPrice: "1850000000",
    FlagWinner: 0
  },
  {
    AuctionRoundId: "round-002", 
    UserName: "Hoàng Văn Nam",
    CitizenIdentification: "321654987",
    RecentLocation: "Cần Thơ",
    TagName: "Lô đất B2",
    AuctionPrice: "1900000000",
    FlagWinner: 0
  },
  {
    AuctionRoundId: "round-003",
    UserName: "Vũ Thị Mai",
    CitizenIdentification: "654987321", 
    RecentLocation: "Hà Nội",
    TagName: "Lô đất C3",
    AuctionPrice: "2600000000",
    FlagWinner: 0
  }
];

// Export combined data for easy usage
export const fakeAuctionData = {
  assets: fakeAuctionAssets,
  auctions: fakeAuctionDataDetail, 
  rounds: fakeAuctionRounds,
  prices: fakeAuctionRoundPrices
};
