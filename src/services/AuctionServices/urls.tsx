export const AuctionAPI = {
    ADDAUCTION: "/Auctions",
    AUCTIONCATEGORY: "/AuctionCategories",
    AUCTIONLIST: "/List",
    AUCTIONDETAIL: "/Detail",
    AUCTIONREGISTERASSET: '/RegisterAuctionDocument/Register-Auction-Document'
} as const;

export type AuctionAPIKey = keyof typeof AuctionAPI;
