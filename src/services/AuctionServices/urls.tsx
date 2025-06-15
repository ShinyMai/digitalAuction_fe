export const AuctionAPI = {
    ADDAUCTION: "/Auctions",
    AUCTIONCATEGORY: "/AuctionCategories",
    AUCTIONLIST: "/List",
} as const;

export type AuctionAPIKey = keyof typeof AuctionAPI;
