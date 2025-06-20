/* eslint-disable @typescript-eslint/no-explicit-any */
export type AuctionAdd = {
  AuctionAssetFile: any[]; // Có thể thay bằng interface cụ thể nếu bạn cung cấp cấu trúc
  AuctionDescription: string;
  AuctionEndDate: Date;
  AuctionMap: [number, number];
  AuctionName: string;
  AuctionPlanningMap: any[]; // Có thể thay bằng interface cụ thể nếu bạn cung cấp cấu trúc
  AuctionRulesFile: any[]; // Có thể thay bằng interface cụ thể nếu bạn cung cấp cấu trúc
  AuctionStartDate: Date;
  CategoryId: number;
  NumberRoundMax: string;
  RegisterEndDate: Date;
  RegisterOpenDate: Date;
  Status: string;
};

export type AuctionCategory = {
  categoryId: number;
  categoryName: string;
};

export type AuctionDataList = {
    auctionId: string;
    auctionName: string;
    categoryId: number;
    registerOpenDate: string;
    registerEndDate: string;
    auctionStartDate: string;
    auctionEndDate: string;
    createdByUserName: string;
}

export type AuctionDataDetail = {
    id: string;
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
    winnerData: string;
}