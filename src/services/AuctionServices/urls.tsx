export const AuctionAPI = {
    ADDAUCTION: "/Auctions",
    AUCTIONCATEGORY: "/AuctionCategories",
    AUCTIONLIST: "/List",
    AUCTIONDETAIL: "/Detail"
} as const;

export type AuctionAPIKey = keyof typeof AuctionAPI;
