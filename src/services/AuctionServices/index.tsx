import http from "../../utils/axiosConfigs";
import { AuctionAPI } from "./urls";

const addAcution = (body: any) =>
    http.post(AuctionAPI.ADDAUCTION, body);

const getListAuctionCategory = () =>
    http.get(AuctionAPI.AUCTIONCATEGORY)

const getListAuction = () =>
    http.get(AuctionAPI.AUCTIONLIST)


const AuctionServices = {
    addAcution,
    getListAuctionCategory,
    getListAuction,
};

export default AuctionServices;
