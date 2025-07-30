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
  _id: string;
  auctionId: string;
  auctionName: string;
  categoryId: number;
  registerOpenDate: string;
  registerEndDate: string;
  auctionStartDate: string;
  auctionEndDate: string;
  createdBy: string;
  createdByUserName?: string;
  updateByUserName?: string;
  status: number;
};

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
  status: number;
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

export type AuctionDocument = {
  auctionDocumentsId: string;
  citizenIdentification: string;
  deposit: number;
  name: string;
  note: string | null;
  numericalOrder: number;
  registrationFee: number;
  statusDeposit: boolean;
  statusRefundDeposit: boolean;
  statusTicket: number;
  tagName: string;
};

export type AuctionDateModal = {
  registerOpenDate?: string;
  registerEndDate?: string;
  auctionStartDate?: string;
  auctionEndDate?: string;
};

export type ModalAuctioners = {
  id: string;
  name: string;
};

export type AuctionRoundModals = {
  auctionRoundId: string;
  auctionId?: string;
  roundNumber: number
  status: number;
}