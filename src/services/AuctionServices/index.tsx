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

const getResultAuctionDetail = (auctionId: string, params?: any): Promise<ApiResponse<any>> =>
  http.get(`${AuctionAPI.RESULT_AUCTION_DETAIL}/${auctionId}`, { params });

const findHighestPriceAndFlag = (auctionId: string): Promise<ApiResponse<any>> =>
  http.get(`${AuctionAPI.FIND_HIGHEST_PRICE_AND_FLAG}/${auctionId}`);

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

const getListAuctionRegisted = (body?: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.LIST_AUCTION_REGISTED, body);

const getListAuctionDocumentRegisted = (body?: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.LIST_AUCTION_DOCUMENT_REGISTED, body);

const createAuctionRound = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.CREATE_AUCTION_ROUND, body);
const getListAuctionRounds = (auctionId: string): Promise<ApiResponse<any>> =>
  http.get(`${AuctionAPI.GET_LIST_AUCTION_ROUND}/${auctionId}`);
const saveListAuctionRoundPrice = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.SAVE_LIST_AUCTION_ROUND_PRICE, body);
const getListAuctionRoundPrices = (auctionRoundId: string): Promise<ApiResponse<any>> =>
  http.get(`${AuctionAPI.GET_LIST_AUCTION_ROUND_PRICE}/${auctionRoundId}`);
const updateWinnerFlag = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.UPDATE_WINNER_FLAG, body);
const waitingPublicAuction = (params: any): Promise<ApiResponse<any>> =>
  http.put(`${AuctionAPI.UPDATE_AUCTION_WAITING_PUBLIC}/${params}`);
const updateStatusAuctionRound = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.UPDATE_STATUS_AUCTION_ROUND, body);
const getListAuctionRoundPriceWinnerByAuctionId = (auctionId: string): Promise<ApiResponse<any>> =>
  http.get(`${AuctionAPI.GET_LIST_AUCTION_ROUND_PRICE_WINNER_BY_AUCTION_ID}/${auctionId}`);
const updateAuctionRejected = (body: any): Promise<ApiResponse<any>> =>
  http.put(AuctionAPI.UPDATE_AUCTION_REJECTED, body);
const updateAuction = (body: any): Promise<ApiResponse<any>> =>
  http.put(AuctionAPI.UPDATE_AUCTION, body);
const exportHandbook = (body: any): Promise<ApiResponse<any>> =>
  http.post(AuctionAPI.EXPORT_HANDBOOK, body);
const exportRefundList = (params: any): Promise<ApiResponse<any>> =>
  http.get(`${AuctionAPI.EXPORT_REFUNDLIST}`, { params });
const AuctionServices = {
  addAuction,
  getListAuctionCategory,
  getListAuction,
  getAuctionDetail,
  getResultAuctionDetail,
  findHighestPriceAndFlag,
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
  getListAuctionDocumentRegisted,
  createAuctionRound,
  getListAuctionRounds,
  saveListAuctionRoundPrice,
  getListAuctionRoundPrices,
  updateWinnerFlag,
  waitingPublicAuction,
  updateStatusAuctionRound,
  getListAuctionRoundPriceWinnerByAuctionId,
  updateAuctionRejected,
  updateAuction,
  exportHandbook,
  exportRefundList
};

export default AuctionServices;
