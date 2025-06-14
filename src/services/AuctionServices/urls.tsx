export const AuctionAPI = {
    ADDAUCTION: "/Auctions",
    AUCTIONCATEGORY: "/AuctionCategories",
} as const;

export type AuctionAPIKey = keyof typeof AuctionAPI;
