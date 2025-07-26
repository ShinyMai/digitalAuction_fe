import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Auctions } from "../../Auctioneer/ModalsDatabase";
import CalendarViewContent from "./components/CalendarViewContent";
import "../../../styles/auction-tabs.css";

interface ListAuctionAssignedProps {
    loading?: boolean;
}

const ListAuctionAssigned: React.FC<ListAuctionAssignedProps> = ({ loading = false }) => {
    const navigate = useNavigate();
    const [assignedAuctions, setAssignedAuctions] = useState<Auctions[]>([]);

    // Dữ liệu mẫu
    useEffect(() => {
        const fakeAuctions: Auctions[] = [
            {
                AuctionId: "1",
                AuctionName: "Đấu giá Bất động sản Quận 1",
                AuctionDescription: "Phiên đấu giá các bất động sản tại Quận 1, TP.HCM",
                AuctionRules: "Quy tắc đấu giá theo hình thức trả giá lên",
                AuctionPlanningMap: "map1.jpg",
                RegisterOpenDate: "2025-07-25T08:00:00",
                RegisterEndDate: "2025-07-30T17:00:00",
                AuctionStartDate: "2025-08-01T09:00:00",
                AuctionEndDate: "2025-08-01T16:00:00",
                AuctionMap: "location1.jpg",
                CreatedAt: "2025-07-20T10:00:00",
                CreatedBy: "admin1",
                UpdatedAt: "2025-07-20T10:00:00",
                UpdatedBy: "admin1",
                QRLink: "qr1.png",
                NumberRoundMax: 3,
                Status: 1,
                WinnerData: "",
                CategoryId: "BDS01",
                AuctioneersId: "auctioneer1",
                CancelReason: "",
                CancelReasonFile: ""
            },
            {
                AuctionId: "2",
                AuctionName: "Đấu giá Xe ô tô thanh lý",
                AuctionDescription: "Phiên đấu giá các xe ô tô thanh lý từ các cơ quan nhà nước",
                AuctionRules: "Quy tắc đấu giá theo vòng",
                AuctionPlanningMap: "map2.jpg",
                RegisterOpenDate: "2025-07-26T08:00:00",
                RegisterEndDate: "2025-08-01T17:00:00",
                AuctionStartDate: "2025-08-03T09:00:00",
                AuctionEndDate: "2025-08-03T16:00:00",
                AuctionMap: "location2.jpg",
                CreatedAt: "2025-07-21T10:00:00",
                CreatedBy: "admin1",
                UpdatedAt: "2025-07-21T10:00:00",
                UpdatedBy: "admin1",
                QRLink: "qr2.png",
                NumberRoundMax: 4,
                Status: 0,
                WinnerData: "",
                CategoryId: "XE01",
                AuctioneersId: "",
                CancelReason: "",
                CancelReasonFile: ""
            },
            {
                AuctionId: "3",
                AuctionName: "Đấu giá Tài sản tịch thu",
                AuctionDescription: "Phiên đấu giá tài sản tịch thu từ các vụ án",
                AuctionRules: "Quy tắc đấu giá kín",
                AuctionPlanningMap: "map3.jpg",
                RegisterOpenDate: "2025-07-20T08:00:00",
                RegisterEndDate: "2025-07-25T17:00:00",
                AuctionStartDate: "2025-07-28T09:00:00",
                AuctionEndDate: "2025-07-28T16:00:00",
                AuctionMap: "location3.jpg",
                CreatedAt: "2025-07-15T10:00:00",
                CreatedBy: "admin1",
                UpdatedAt: "2025-07-15T10:00:00",
                UpdatedBy: "admin1",
                QRLink: "qr3.png",
                NumberRoundMax: 2,
                Status: 3,
                WinnerData: "",
                CategoryId: "TS01",
                AuctioneersId: "auctioneer1",
                CancelReason: "Không đủ số lượng người đăng ký tham gia",
                CancelReasonFile: "cancel3.pdf"
            }
        ];

        setAssignedAuctions(fakeAuctions);
    }, []);

    return (
        <CalendarViewContent
            loading={loading}
            auctions={assignedAuctions}
            onNavigate={navigate}
        />
    );
};

export default ListAuctionAssigned;
