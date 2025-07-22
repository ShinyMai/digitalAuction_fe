export interface RegisteredAuction {
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
  numberRoundMax: number;
  status: number;
  auctionAssets: {
    auctionAssetsId: string;
    tagName: string;
    startingPrice: number;
    unit: string;
    deposit: number;
    registrationFee: number;
    description: string;
    auctionId: string;
  }[];
}

export interface Stats {
  total: number;
  registration: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  cancelled: number;
}

export type StatusString = "registration" | "upcoming" | "ongoing" | "completed" | "cancelled";

export interface StatusInfo {
  color: string;
  icon: React.ReactNode;
  text: string;
  bgColor: string;
  borderColor: string;
}
