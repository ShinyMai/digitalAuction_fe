import { AuctionAssets, Auctions } from "../../Company/DataConst";
import AuctionServices from "../../../services/AuctionServices";
import { useEffect, useState } from "react";
import type { AuctionDataList } from "./Modals";
import AcutionTable from "./component/AuctionTable";

interface AuctionParams {
    AuctionName: string;
    CategoryId: number;
    RegisterOpenDate: string;
    RegisterEndDate: string;
    AuctionStartDate: string;
    AuctionEndDate: string;
    SortBy: string;
    IsAscending: boolean;
    PageNumber: number;
    PageSize: number;
}

const AuctionList = () => {
    const DataAuction = [...Auctions];
    const DataAcutionAssets = [...AuctionAssets];
    const [totalData, setTotalData] = useState<number>(0);
    const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);
    const [sortParams, setSortParams] = useState<{ SortBy: string; IsAscending: boolean }>({
        SortBy: "",
        IsAscending: true,
    });

    const onSearch = (searchValue: any) => {
        console.log("Tìm kiếm:", searchValue);
    };

    useEffect(() => {
        getListAuction();
    }, [sortParams]);

    const getListAuction = async () => {
        try {
            const params: AuctionParams = {
                AuctionName: "",
                CategoryId: 0,
                RegisterOpenDate: "",
                RegisterEndDate: "",
                AuctionStartDate: "",
                AuctionEndDate: "",
                SortBy: sortParams.SortBy,
                IsAscending: sortParams.IsAscending,
                PageNumber: 1,
                PageSize: 10,
            };
            const response = await AuctionServices.getListAuction();
            console.log(response.data);
            setTotalData(response.data.totalCount);
            setAuctionList(response.data.auctions);
        } catch (error) {
            console.log(error);
        }
    };

    const onSort = (column: string, order: "ascend" | "descend" | undefined) => {
        console.log("Sắp xếp:", { column, order });
        setSortParams({
            SortBy: column || "",
            IsAscending: order === "ascend" ? true : false,
        });
    };

    return (
        <section className="w-full h-full">
            <div className="w-full h-full">
                <div className="w-full h-full" id="table-list">
                    <AcutionTable AuctionData={auctionList} onSearch={onSearch} onSort={onSort} />
                </div>
            </div>
        </section>
    );
};

export default AuctionList;