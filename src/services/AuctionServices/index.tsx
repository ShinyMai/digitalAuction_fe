import http from "../../utils/axiosConfigs";
import { AuctionAPI } from "./urls";

const addAuction = (body: any) =>
    http.post(AuctionAPI.ADDAUCTION, body);

const getListAuctionCategory = () =>
    http.get(AuctionAPI.AUCTIONCATEGORY)

const getListAuction = (params?: any) =>
    http.get(AuctionAPI.AUCTIONLIST, { params: params })

const getAuctionDetail = (params?: string) =>
    http.get(`${AuctionAPI.AUCTIONDETAIL}/${params}`)
const registerAuctionAsset = (body: any) =>
    http.post(AuctionAPI.AUCTIONREGISTERASSET, body);

const AuctionServices = {
    addAuction,
    getListAuctionCategory,
    getListAuction,
    getAuctionDetail,
    registerAuctionAsset
};

export default AuctionServices;
