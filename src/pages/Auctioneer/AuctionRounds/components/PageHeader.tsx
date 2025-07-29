import { Button, Typography, Alert } from "antd";
import { PlusOutlined, StopOutlined, EyeOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import type { AuctionDataDetail } from "../../Modals";

const { Title } = Typography;

interface PageHeaderProps {
    auction?: AuctionDataDetail;
    onCreateClick: () => void;
    onEndAuction?: () => void;
    onViewResults?: () => void;
}

const USER_ROLES = {
    USER: "Customer",
    ADMIN: "Admin",
    STAFF: "Staff",
    AUCTIONEER: "Auctioneer",
    MANAGER: "Manager",
    DIRECTOR: "Director",
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

const PageHeader = ({ auction, onCreateClick, onEndAuction, onViewResults }: PageHeaderProps) => {

    const { user } = useSelector((state: RootState) => state.auth);
    const role = user?.roleName as UserRole | undefined;

    return (
        <div className="!mb-6">
            <div className="!flex !justify-between !items-center !mb-4">
                <Title level={2} className="!m-0 !text-gray-800">
                    Quản lý vòng đấu giá
                </Title>

                {auction?.status === 1 ? (
                    role === USER_ROLES.AUCTIONEER && (
                        <div className="flex gap-3">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={onCreateClick}
                                className="!bg-green-500 !border-green-500 hover:!bg-green-600 !h-10 !px-6"
                            >
                                Tạo vòng đấu giá
                            </Button>

                            <Button
                                danger
                                icon={<StopOutlined />}
                                size="large"
                                onClick={onEndAuction}
                                className="!h-10 !px-6"
                            >
                                Kết thúc phiên đấu giá
                            </Button>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-end gap-3">
                        <Alert
                            message="Phiên đấu giá đã kết thúc"
                            type="info"
                            showIcon
                            className="!mb-2"
                        />
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            size="large"
                            onClick={onViewResults}
                            className="!bg-blue-500 !border-blue-500 hover:!bg-blue-600 !h-10 !px-6"
                        >
                            Xem kết quả đấu giá
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
