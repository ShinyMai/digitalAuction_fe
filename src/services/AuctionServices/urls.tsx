export const AuctionAPI = {
  ADD_AUCTION: "/Auctions",
  AUCTION_CATEGORY: "/AuctionCategories",
  AUCTION_LIST: "/List",
  AUCTION_DETAIL: "/Detail",
  AUCTION_REGISTER_ASSET:
    "/RegisterAuctionDocument/Register-Auction-Document",
  AUCTION_DOCUMENT_LIST:
    "/ListDocuments",
  AUCTION_PUBLIC_REGIST_AUCTIONEER:
    "/AssginAuctioneerAndPublicAuction/Assgin-Auctioneer-Public-Auction",
  GET_AUCTION_BYID:
    "/DetailAuctionDocument/Detail-Auction-Document",
  GET_LIST_AUCTIONERS: '/GetAuctioneers/Get-Auctioneers',
  SUPPORT_REGISTER_AUCTION: '/AuctionDocuments/support-register',
  RECEIVE_AUCTION_REGISTRATION_DOCUMENT: '/ReceiveAuctionRegistrationForm/Receive-Auction-Registration-Form',
  ACCEPT_PAYMENT_DEPOSIT: '/UpdateDeposit'
} as const;

export type AuctionAPIKey = keyof typeof AuctionAPI;
