export const AuctionAssetAPI = {
  LIST_AUCTION_ASSET: "/ListAuctionAsset/List-Auction-Asset",
  DETAIL_AUCTION_ASSET: "/DetailAuctionAsset/Detail-Auction-Asset",
} as const;

export type AuctionAssetAPIKey = keyof typeof AuctionAssetAPI;
