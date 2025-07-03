export const AuctionAPI = {
    ADD_AUCTION: "/Auctions",
    AUCTION_CATEGORY: "/AuctionCategories",
    AUCTION_LIST: "/List",
    AUCTION_DETAIL: "/Detail",
    AUCTION_REGISTER_ASSET: '/RegisterAuctionDocument/Register-Auction-Document',
    AUCTION_DOCUMENT_LIST: '/GetListAuctionDocuments/ListDocuments',
    AUCTION_PUBLIC_REGIST_AUCTIONEER: '/AssginAuctioneerAndPublicAuction/Assgin-Auctioneer-Public-Auction'
} as const;

export type AuctionAPIKey = keyof typeof AuctionAPI;
