export type AuctionDataList = {
    auctionId: string;
    auctionName: string;
    categoryId: number;
    registerOpenDate: string;
    registerEndDate: string;
    auctionStartDate: string;
    auctionEndDate: string;
    createdByUserName: string;
}

export type AuctionDataDetail = {
    id: string;
    Auction_Name: string;
    Auction_Category_id: number;
    Auction_description: string;
    Auction_Rules: string;
    Auction_Planning_Map: string;
    Register_open_date: string;
    Register_end_date: string;
    Auction_start_date: string;
    Auction_end_date: string;
    CreateBy: string;
    CreateAt: string;
    UpdateBy: string;
    UpdateAt: string;
    Or_link: string;
    Number_round_max: number;
    Status: string;
    Winner_data: string;
}