/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "../../utils/axiosConfigs";
import { AuctionAPI } from "./urls";

const addAuction = (body: any) =>
  http.post(AuctionAPI.ADD_AUCTION, body);

const getListAuctionCategory = () =>
  http.get(AuctionAPI.AUCTION_CATEGORY);

const getListAuction = (params?: any) =>
  http.get(AuctionAPI.AUCTION_LIST, { params: params });

const getAuctionDetail = (params?: string) =>
  http.get(`${AuctionAPI.AUCTION_DETAIL}/${params}`);
const registerAuctionAsset = (body: any) =>
  http.post(AuctionAPI.AUCTION_REGISTER_ASSET, body);
const getListAuctionDocument = (
  params?: any,
  auctionId?: string
) =>
  http.get(
    AuctionAPI.AUCTION_DOCUMENT_LIST + `/${auctionId}`,
    { params: params }
  );
const assginAuctioneerAndPublicAuction = (body: any) =>
  http.post(
    AuctionAPI.AUCTION_PUBLIC_REGIST_AUCTIONEER,
    body
  );
const AuctionServices = {
  addAuction,
  getListAuctionCategory,
  getListAuction,
  getAuctionDetail,
  registerAuctionAsset,
  getListAuctionDocument,
  assginAuctioneerAndPublicAuction,
};

export default AuctionServices;
