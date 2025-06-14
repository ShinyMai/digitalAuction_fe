import http from "../../utils/axiosConfigs";
import { AuctionAPI } from "./urls";


interface AuctionAdd {
    AuctionAssetFile: any[]; // Có thể thay bằng interface cụ thể nếu bạn cung cấp cấu trúc
    AuctionDescription: string;
    AuctionEndDate: Date;
    AuctionMap: [number, number];
    AuctionName: string;
    AuctionPlanningMap: any[]; // Có thể thay bằng interface cụ thể nếu bạn cung cấp cấu trúc
    AuctionRulesFile: any[]; // Có thể thay bằng interface cụ thể nếu bạn cung cấp cấu trúc
    AuctionStartDate: Date;
    CategoryId: number;
    NumberRoundMax: string;
    RegisterEndDate: Date;
    RegisterOpenDate: Date;
    Status: string;
}

const addAcution = (body: any) =>
    http.post(AuctionAPI.ADDAUCTION, body);

const getListAuctionCategory = () =>
    http.get(AuctionAPI.AUCTIONCATEGORY)

const AuctionServices = {
    addAcution,
    getListAuctionCategory,
};

export default AuctionServices;
