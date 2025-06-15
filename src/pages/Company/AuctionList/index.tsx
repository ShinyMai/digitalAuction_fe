import AcutionList from "./component/AuctionList"
import { AuctionAssets, Auctions } from "../../Company/DataConst"
import AuctionServices from "../../../services/AuctionServices";
import { useEffect, useState } from "react";

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

    const DataAuction = [...Auctions]
    const DataAcutionAssets = [...AuctionAssets]
    const [totalData, setTotalData] = useState()
    const [auctionList, setAuctionList] = useState()

    const onSearch = (searchValue: any) => {
        console.log("abww", searchValue)
    }

    useEffect(() => {
        getListAuction()
    }, [])

    const getListAuction = async () => {
        try {
            const response = await AuctionServices.getListAuction()
            console.log(response.data.data)
            setTotalData(response.data.data.totalCount)
            setAuctionList(response.data.data.auctions)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="w-full h-full">
            <div className="w-full h-full">

                <div className="w-full h-full" id="table-list">
                    <AcutionList AuctionData={auctionList} onSearch={onSearch} />
                </div>
            </div>
        </section>
    )
}

export default AuctionList