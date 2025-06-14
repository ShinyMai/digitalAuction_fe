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
}

export type AuctionCategory = {
    categoryId: number,
    categoryName: string,
}