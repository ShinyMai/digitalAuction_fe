/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse } from "../../types/responseAxios";
import { http, httpNode } from "../../utils/axiosConfigs";
import { AuctionAPI } from "./urls";

const addAuction = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.ADD_AUCTION, body);

const addAuctionNode = (body: any): Promise<ApiResponse<any>> =>
  httpNode.post(AuctionAPI.ADD_AUCTION_NODE, body);

const getListAuctionCategory = (): Promise<ApiResponse<any>> =>
  http.get(AuctionAPI.AUCTION_CATEGORY);

const getListAuction = (params?: any): Promise<ApiResponse<any>> =>
  http.get(AuctionAPI.AUCTION_LIST, { params: params });

const getListAuctionNode = (params?: any): Promise<ApiResponse<any>> =>
  httpNode.get(AuctionAPI.AUCTION_LIST_PUBLIC_NODE, {
    params: params,
  });

const getAuctionDetail = (params?: string): Promise<ApiResponse<any>> =>
  http.get(`${AuctionAPI.AUCTION_DETAIL}/${params}`);

const getAuctionDetailNode = (params?: string): Promise<ApiResponse<any>> =>
  httpNode.get(`${AuctionAPI.AUCTION_DETAIL_NODE}/${params}`);

const registerAuctionAsset = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.AUCTION_REGISTER_ASSET, body);

const getListAuctionDocument = (body?: any, auctionId?: string): Promise<ApiResponse<any>> =>
  http.get(AuctionAPI.AUCTION_DOCUMENT_LIST + `/${auctionId}`, { params: body });

const assginAuctioneerAndPublicAuction = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.AUCTION_PUBLIC_REGIST_AUCTIONEER, body);

const getAuctionById = (id: string): Promise<ApiResponse<any>> =>
  http.get(`${AuctionAPI.GET_AUCTION_BYID}?AuctionDocumentsId=${id}`);

const getListAuctioners = (): Promise<ApiResponse<any>> => http.get(AuctionAPI.GET_LIST_AUCTIONERS);

const supportRegisterAuction = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.SUPPORT_REGISTER_AUCTION, body);

const receiveAuctionRegistrationDocument = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.RECEIVE_AUCTION_REGISTRATION_DOCUMENT, body);

const acceptPaymentDeposit = (
  auctionId: any,
  auctionDocumentId: any,
  body: any
): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.ACCEPT_PAYMENT_DEPOSIT + `/${auctionId}` + `/${auctionDocumentId}`, body);
const cancelAuction = (body: any): Promise<ApiResponse<any>> =>
  http.put(AuctionAPI.AUCTION_CANCEL, body);
const userRegistedAuction = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.USER_REGISTER_AUCTION, body);

const getListAuctionRegisted = (params?: any): Promise<ApiResponse<any>> =>
  http.get(AuctionAPI.LIST_AUCTION_REGISTED, { params: params });

const AuctionServices = {
  addAuction,
  getListAuctionCategory,
  getListAuction,
  getAuctionDetail,
  registerAuctionAsset,
  getListAuctionDocument,
  assginAuctioneerAndPublicAuction,
  getAuctionById,
  getListAuctioners,
  supportRegisterAuction,
  receiveAuctionRegistrationDocument,
  acceptPaymentDeposit,
  getListAuctionNode,
  getAuctionDetailNode,
  addAuctionNode,
  cancelAuction,
  userRegistedAuction,
  getListAuctionRegisted,
};

export default AuctionServices;
