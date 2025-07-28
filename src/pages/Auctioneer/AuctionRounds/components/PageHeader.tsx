import { Button, Typography } from "antd";
import { PlusOutlined, StopOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";

const { Title } = Typography;

interface PageHeaderProps {
    onCreateClick: () => void;
    onEndAuction?: () => void;
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

const PageHeader = ({ onCreateClick, onEndAuction }: PageHeaderProps) => {

    const { user } = useSelector((state: RootState) => state.auth);
    const role = user?.roleName as UserRole | undefined;
    return (
        <div className="!mb-6">
            <div className="!flex !justify-between !items-center !mb-4">
                <Title level={2} className="!m-0 !text-gray-800">
                    Quản lý vòng đấu giá
                </Title>
                {
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
                }

            </div>
        </div>
    );
};

export default PageHeader;
