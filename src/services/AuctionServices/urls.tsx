export const AuctionAPI = {
  ADD_AUCTION: "/Auctions",
  ADD_AUCTION_NODE: "/auctions/createAuction",
  AUCTION_CATEGORY: "/AuctionCategories",
  AUCTION_LIST: "/List",
  AUCTION_LIST_PUBLIC_NODE: "/auctions/listAuctionPublic",
  AUCTION_DETAIL: "/Detail",
  AUCTION_DETAIL_NODE: "/auctions/getAuctionById",
  AUCTION_REGISTER_ASSET: "/RegisterAuctionDocument/Register-Auction-Document",
  AUCTION_DOCUMENT_LIST: "/ListDocuments",
  AUCTION_PUBLIC_REGIST_AUCTIONEER:
    "/AssginAuctioneerAndPublicAuction/Assgin-Auctioneer-Public-Auction",
  GET_AUCTION_BYID: "/DetailAuctionDocument/Detail-Auction-Document",
  GET_LIST_AUCTIONERS: "/GetAuctioneers/Get-Auctioneers",
  SUPPORT_REGISTER_AUCTION: "/AuctionDocuments/support-register",
  RECEIVE_AUCTION_REGISTRATION_DOCUMENT:
    "/ReceiveAuctionRegistrationForm/Receive-Auction-Registration-Form",
  ACCEPT_PAYMENT_DEPOSIT: "/UpdateDeposit",
  AUCTION_CANCEL: "/Auctions/cancel",
  USER_REGISTER_AUCTION: "/UserRegisteredAuction/User-Registered-Auction",
  LIST_AUCTION_REGISTED: "ListAuctionRegisted/List-Auction-Registed",
  LIST_AUCTION_DOCUMENT_REGISTED: "AuctionDocumentRegisted/Auction-Document-Registed",
} as const;

export type AuctionAPIKey = keyof typeof AuctionAPI;
