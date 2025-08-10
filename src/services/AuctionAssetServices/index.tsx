/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse } from "../../types/responseAxios";
import { http } from "../../utils/axiosConfigs";
import { AuctionAssetAPI } from "./url";

const getListAuctionAsset = (params: any): Promise<ApiResponse> =>
  http.get(AuctionAssetAPI.LIST_AUCTION_ASSET, { params: params });

const getDetailAuctionAsset = (params: string): Promise<ApiResponse> =>
  http.get(AuctionAssetAPI.DETAIL_AUCTION_ASSET, {
    params: { auctionAssetId: params },
  });

const AuctionAssetServices = {
  getListAuctionAsset,
  getDetailAuctionAsset,
};

export default AuctionAssetServices;
