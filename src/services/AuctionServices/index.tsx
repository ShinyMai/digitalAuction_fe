/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse } from "../../types/responseAxios";
import http from "../../utils/axiosConfigs";
import { AuctionAPI } from "./urls";

const addAuction = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.ADD_AUCTION, body);

const getListAuctionCategory = (): Promise<
  ApiResponse<any>
> => http.get(AuctionAPI.AUCTION_CATEGORY);

const getListAuction = (
  params?: any
): Promise<ApiResponse<any>> =>
  http.get(AuctionAPI.AUCTION_LIST, { params: params });

const getAuctionDetail = (
  params?: string
): Promise<ApiResponse<any>> =>
  http.get(`${AuctionAPI.AUCTION_DETAIL}/${params}`);
const registerAuctionAsset = (
  body: any
): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.AUCTION_REGISTER_ASSET, body);
const getListAuctionDocument = (
  params?: any,
  auctionId?: string
): Promise<ApiResponse<any>> =>
  http.get(
    AuctionAPI.AUCTION_DOCUMENT_LIST + `/${auctionId}`,
    { params: params }
  );
const assginAuctioneerAndPublicAuction = (
  body: any
): Promise<ApiResponse<any>> =>
  http.post(
    AuctionAPI.AUCTION_PUBLIC_REGIST_AUCTIONEER,
    body
  );
const getAuctionById = (
  id: string
): Promise<ApiResponse<any>> =>
  http.get(
    `${AuctionAPI.GET_AUCTION_BYID}?AuctionDocumentsId=${id}`
  );
const AuctionServices = {
  addAuction,
  getListAuctionCategory,
  getListAuction,
  getAuctionDetail,
  registerAuctionAsset,
  getListAuctionDocument,
  assginAuctioneerAndPublicAuction,
  getAuctionById,
};

export default AuctionServices;
