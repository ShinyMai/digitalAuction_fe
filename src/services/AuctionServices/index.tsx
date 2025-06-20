import http from "../../utils/axiosConfigs";
import { AuctionAPI } from "./urls";

const addAcution = (body: any) =>
    http.post(AuctionAPI.ADDAUCTION, body);

const getListAuctionCategory = () =>
    http.get(AuctionAPI.AUCTIONCATEGORY)

const getListAuction = (params?: any) =>
    http.get(AuctionAPI.AUCTIONLIST, { params: params })

const getAuctionDetail = (params?: string) =>
    http.get(`${AuctionAPI.AUCTIONDETAIL}/${params}`)



const AuctionServices = {
    addAcution,
    getListAuctionCategory,
    getListAuction,
    getAuctionDetail
};

export default AuctionServices;
