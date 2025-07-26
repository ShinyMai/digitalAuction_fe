import type { AuctionRoundPrice, AuctionRound, AuctionDataDetail, AuctionAsset } from "./modalsData";

// Fake data cho AuctionAsset - Chỉ giữ lại các trường cần thiết
export const fakeAuctionAssets: AuctionAsset[] = [
  {
    auctionAssetsId: "AA001",
    tagName: "Căn hộ chung cư cao cấp",
    startingPrice: "150000000",
    unit: "VND",
    deposit: "15000000",
    registrationFee: "1000000",
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
    startingPrice: "175000000",
    unit: "VND",
    deposit: "17500000",
    registrationFee: "1200000",
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
    startingPrice: "165000000",
    unit: "VND",
    deposit: "16500000",
    registrationFee: "1100000",
    description: "Lô đất 120m2, vị trí đẹp trong khu đô thị mới, đã có sổ đỏ",
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
    auctionId: "AU001",
    auction: "Đấu giá tài sản tháng 1/2025"
  },
  {
    auctionAssetsId: "AA004",
    tagName: "Villa biệt thự",
    startingPrice: "350000000",
    unit: "VND",
    deposit: "35000000",
    registrationFee: "2000000",
    description: "Villa sang trọng 2 tầng, hồ bơi riêng, sân vườn rộng 500m2",
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
    auctionId: "AU002",
    auction: "Đấu giá tài sản cao cấp Q1"
  },
  {
    auctionAssetsId: "AA005",
    tagName: "Shophouse thương mại",
    startingPrice: "280000000",
    unit: "VND",
    deposit: "28000000",
    registrationFee: "1500000",
    description: "Shophouse 4 tầng mặt tiền chính, vị trí kinh doanh đắc địa",
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
    auctionId: "AU002",
    auction: "Đấu giá tài sản cao cấp Q1"
  }
];

// Fake data cho AuctionDataDetail - Chỉ giữ lại các trường cần thiết
export const fakeAuctionDataDetail: AuctionDataDetail = {
  auctionId: "AU001",
  auctionName: "Đấu giá tài sản bất động sản tháng 1/2025",
  categoryName: "Bất động sản",
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
  numberRoundMax: 5,
  status: "active",
  auctionMap: "",
  winnerData: "",
  auctioneer: "",
  listAuctionAssets: fakeAuctionAssets.slice(0, 3)
};

// Fake data cho AuctionRound - Multiple rounds cho cùng 1 auction
export const fakeAuctionRounds: AuctionRound[] = [
  {
    auctionRoundId: "AR001",
    auction: fakeAuctionDataDetail,
    roundNumber: 1,
    status: 2 // Completed
  },
  {
    auctionRoundId: "AR002",
    auction: fakeAuctionDataDetail,
    roundNumber: 2,
    status: 2 // Completed
  },
  {
    auctionRoundId: "AR003",
    auction: fakeAuctionDataDetail,
    roundNumber: 3,
    status: 1 // Active - Round hiện tại
  },
  {
    auctionRoundId: "AR004",
    auction: fakeAuctionDataDetail,
    roundNumber: 4,
    status: 0 // Pending
  },
  {
    auctionRoundId: "AR005",
    auction: fakeAuctionDataDetail,
    roundNumber: 5,
    status: 0 // Pending
  }
];

// Fake data cho AuctionRoundPrice - Phân theo các round khác nhau
export const fakeAuctionRoundPrices: AuctionRoundPrice[] = [
  // Round 1 - Completed
  {
    AuctionRoundId: "AR001", // Round 1
    UserName: "Nguyễn Văn An",
    CitizenIdentification: "001199001234",
    RecentLocation: "Hà Nội",
    TagName: "Căn hộ chung cư cao cấp",
    AuctionPrice: "150000000"
  },
  {
    AuctionRoundId: "AR001", // Round 1
    UserName: "Trần Thị Bình",
    CitizenIdentification: "001299005678",
    RecentLocation: "Hồ Chí Minh",
    TagName: "Nhà phố 3 tầng",
    AuctionPrice: "175000000",
    FlagWinner: 1 // Winner of Round 1
  },
  {
    AuctionRoundId: "AR001", // Round 1
    UserName: "Lê Văn Cường",
    CitizenIdentification: "001399009012",
    RecentLocation: "Đà Nẵng",
    TagName: "Đất nền khu đô thị",
    AuctionPrice: "165000000"
  },

  // Round 2 - Completed
  {
    AuctionRoundId: "AR002", // Round 2
    UserName: "Phạm Thị Diệu",
    CitizenIdentification: "001499003456",
    RecentLocation: "Hải Phòng",
    TagName: "Villa biệt thự",
    AuctionPrice: "350000000"
  },
  {
    AuctionRoundId: "AR002", // Round 2
    UserName: "Hoàng Văn Em",
    CitizenIdentification: "001599007890",
    RecentLocation: "Cần Thơ",
    TagName: "Shophouse thương mại",
    AuctionPrice: "280000000",
    FlagWinner: 1 // Winner of Round 2
  },
  {
    AuctionRoundId: "AR002", // Round 2
    UserName: "Vũ Thị Phương",
    CitizenIdentification: "001699001234",
    RecentLocation: "Hà Nội",
    TagName: "Văn phòng cao ốc",
    AuctionPrice: "195000000"
  },

  // Round 3 - Currently Active
  {
    AuctionRoundId: "AR003", // Round 3
    UserName: "Đỗ Văn Giang",
    CitizenIdentification: "001799005678",
    RecentLocation: "Huế",
    TagName: "Kho xưởng công nghiệp",
    AuctionPrice: "170000000"
  },
  {
    AuctionRoundId: "AR003", // Round 3
    UserName: "Bùi Thị Hằng",
    CitizenIdentification: "001899009012",
    RecentLocation: "Vũng Tàu",
    TagName: "Resort nghỉ dưỡng",
    AuctionPrice: "160000000"
  },
  {
    AuctionRoundId: "AR003", // Round 3
    UserName: "Ngô Văn Inh",
    CitizenIdentification: "001999003456",
    RecentLocation: "Nha Trang",
    TagName: "Khách sạn mini",
    AuctionPrice: "185000000"
  },
  {
    AuctionRoundId: "AR003", // Round 3
    UserName: "Lý Thị Kim",
    CitizenIdentification: "002099007890",
    RecentLocation: "Quy Nhon",
    TagName: "Đất nông nghiệp",
    AuctionPrice: "172000000"
  },
  {
    AuctionRoundId: "AR003", // Round 3
    UserName: "Mai Văn Long",
    CitizenIdentification: "002199001122",
    RecentLocation: "Đà Nẵng",
    TagName: "Villa biệt thự",
    AuctionPrice: "380000000"
  },
  {
    AuctionRoundId: "AR003", // Round 3
    UserName: "Phan Thị Hoa",
    CitizenIdentification: "002299003344",
    RecentLocation: "Hồ Chí Minh",
    TagName: "Shophouse thương mại",
    AuctionPrice: "290000000"
  },
  {
    AuctionRoundId: "AR003", // Round 3
    UserName: "Võ Văn Nam",
    CitizenIdentification: "002399005566",
    RecentLocation: "Hà Nội",
    TagName: "Căn hộ chung cư cao cấp",
    AuctionPrice: "165000000"
  },
  {
    AuctionRoundId: "AR003", // Round 3
    UserName: "Đinh Thị Oanh",
    CitizenIdentification: "002499007788",
    RecentLocation: "Hải Phòng",
    TagName: "Nhà phố 3 tầng",
    AuctionPrice: "185000000"
  },
  {
    AuctionRoundId: "AR003", // Round 3
    UserName: "Tăng Văn Phú",
    CitizenIdentification: "002599009900",
    RecentLocation: "Cần Thơ",
    TagName: "Resort nghỉ dưỡng",
    AuctionPrice: "175000000"
  }
];