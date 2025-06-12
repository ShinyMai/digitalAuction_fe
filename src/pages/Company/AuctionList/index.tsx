import AcutionList from "./component/AuctionList"
import { AuctionAssets, Auctions } from "../../Company/DataConst"

const AuctionList = () => {

    const DataAuction = [...Auctions]
    const DataAcutionAssets = [...AuctionAssets]

    const onSearch = (searchValue: any) => {
        console.log("abww", searchValue)
    }

    return (
        <section className="w-full h-full">
            <div className="w-full h-full">

                <div className="w-full h-full" id="table-list">
                    <AcutionList AuctionData={DataAuction} onSearch={onSearch} />
                </div>
            </div>
        </section>
    )
}

export default AuctionList