import type { AuctionRoundPrice, AuctionRound, AuctionDataDetail, AuctionAsset } from "./modalsData";

// Fake data cho AuctionAsset
export const fakeAuctionAssets: AuctionAsset[] = [
  {
    auctionAssetsId: "AA001",
    tagName: "Căn hộ chung cư cao cấp",
    startingPrice: "1500000000",
    unit: "VND",
    deposit: "150000000",
    registrationFee: "10000000",
    description: "Căn hộ 3 phòng ngủ, 2 toilet, view hồ, đầy đủ nội thất cao cấp",
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
    auctionId: "AU001",
    auction: "Đấu giá tài sản tháng 1/2025"
  },
  {
    auctionAssetsId: "AA002",
    tagName: "Nhà phố 3 tầng",
    startingPrice: "1750000000",
    unit: "VND",
    deposit: "175000000",
    registrationFee: "12000000",
    description: "Nhà phố mặt tiền đường lớn, 3 tầng, 4 phòng ngủ, có gara ô tô",
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
    auctionId: "AU001",
    auction: "Đấu giá tài sản tháng 1/2025"
  },
  {
    auctionAssetsId: "AA003",
    tagName: "Đất nền khu đô thị",
    startingPrice: "1650000000",
    unit: "VND",
    deposit: "165000000",
    registrationFee: "11000000",
    description: "Lô đất 120m2, vị trí đẹp trong khu đô thị mới, đã có sổ đỏ",
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
    auctionId: "AU001",
    auction: "Đấu giá tài sản tháng 1/2025"
  }
];

// Fake data cho AuctionDataDetail
export const fakeAuctionDataDetail: AuctionDataDetail = {
  auctionId: "AU001",
  auctionName: "Đấu giá tài sản tháng 1/2025",
  categoryName: "Bất động sản",
  auctionDescription: "Phiên đấu giá các tài sản bất động sản cao cấp",
  auctionRules: "Quy tắc đấu giá theo luật định",
  auctionPlanningMap: "",
  registerOpenDate: "2025-01-10",
  registerEndDate: "2025-01-14",
  auctionStartDate: "2025-01-15",
  auctionEndDate: "2025-01-16",
  createdByUserName: "Admin",
  createdAt: "2025-01-01",
  updatedByUserName: "Admin",
  updatedAt: "2025-01-01",
  qrLink: "",
  numberRoundMax: 5,
  status: "active",
  auctionMap: "",
  winnerData: "",
  auctioneer: "",
  listAuctionAssets: fakeAuctionAssets
};

// Fake data cho AuctionRound
export const fakeAuctionRounds: AuctionRound[] = [
  {
    auctionRoundId: "AR001",
    auction: fakeAuctionDataDetail,
    roundNumber: 1,
    status: 1 // Active
  }
];

// Fake data cho AuctionRoundPrice - đây là data chính
export const fakeAuctionRoundPrices: AuctionRoundPrice[] = [
  {
    auctionRoundPriceId: "ARP001",
    auctionRoundId: "AR001",
    userName: "Nguyễn Văn A",
    citizenIdentification: "123456789012",
    recentLocation: "Hà Nội",
    tagName: "Căn hộ chung cư cao cấp",
    auctionPrice: 1600000000,
    flagWinner: false
  },
  {
    auctionRoundPriceId: "ARP002",
    auctionRoundId: "AR001",
    userName: "Trần Thị B",
    citizenIdentification: "987654321098",
    recentLocation: "TP.HCM",
    tagName: "Căn hộ chung cư cao cấp",
    auctionPrice: 1700000000,
    flagWinner: true
  },
  {
    auctionRoundPriceId: "ARP003",
    auctionRoundId: "AR001",
    userName: "Lê Văn C",
    citizenIdentification: "456789123456",
    recentLocation: "Đà Nẵng",
    tagName: "Nhà phố 3 tầng",
    auctionPrice: 1850000000,
    flagWinner: false
  },
  {
    auctionRoundPriceId: "ARP004",
    auctionRoundId: "AR001",
    userName: "Phạm Thị D",
    citizenIdentification: "789123456789",
    recentLocation: "Cần Thơ",
    tagName: "Nhà phố 3 tầng",
    auctionPrice: 1950000000,
    flagWinner: true
  },
  {
    auctionRoundPriceId: "ARP005",
    auctionRoundId: "AR001",
    userName: "Hoàng Văn E",
    citizenIdentification: "321654987321",
    recentLocation: "Hải Phòng",
    tagName: "Đất nền khu đô thị",
    auctionPrice: 1800000000,
    flagWinner: true
  },
  {
    auctionRoundPriceId: "ARP006",
    auctionRoundId: "AR001",
    userName: "Vũ Thị F",
    citizenIdentification: "654987321654",
    recentLocation: "Nha Trang",
    tagName: "Căn hộ chung cư cao cấp",
    auctionPrice: 1550000000,
    flagWinner: false
  },
  {
    auctionRoundPriceId: "ARP007",
    auctionRoundId: "AR001",
    userName: "Đỗ Văn G",
    citizenIdentification: "147258369147",
    recentLocation: "Huế",
    tagName: "Đất nền khu đô thị",
    auctionPrice: 1720000000,
    flagWinner: false
  }
];

// Fake data cho header thống kê
export const fakeHeaderStats = {
  auctionRoundId: "AR001",
  auctionName: "Đấu giá tài sản tháng 1/2025",
  status: "active" as const,
  currentRound: 1,
  totalRounds: 5,
  totalParticipants: 35,
  totalAssets: 3,
  totalBids: 127,
  highestBid: 2200000000,
  progress: 75
};

// Fake data cho asset analysis
export const fakeAssetAnalysis = {
  assetId: "AA001",
  tagName: "Căn hộ chung cư cao cấp",
  startingPrice: 1500000000,
  currentHighestBid: 1700000000,
  winnerInfo: {
    userName: "Trần Thị B",
    citizenIdentification: "987654321098",
    finalBid: 1700000000,
    isConfirmed: true
  },
  bidHistory: fakeAuctionRoundPrices.filter(price => price.tagName === "Căn hộ chung cư cao cấp"),
  participantCount: 12,
  priceIncrease: 200000000,
  priceIncreasePercent: 13.33
};

// Fake data cho statistics
export const fakeStatistics = {
  averageBidAmount: 1750000000,
  participationStats: {
    totalParticipants: 35,
    activeParticipants: 28,
    averageBidsPerParticipant: 3.6
  },
  priceDistribution: [
    { range: "1-1.5 tỷ", count: 15, percentage: 11.8 },
    { range: "1.5-2 tỷ", count: 62, percentage: 48.8 },
    { range: "2-2.5 tỷ", count: 50, percentage: 39.4 }
  ]
};