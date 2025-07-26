import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface PageHeaderProps {
    onCreateClick: () => void;
}

const PageHeader = ({ onCreateClick }: PageHeaderProps) => {
    return (
        <div className="!mb-6">
            <div className="!flex !justify-between !items-center !mb-4">
                <Title level={2} className="!m-0 !text-gray-800">
                    Quản lý vòng đấu giá
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={onCreateClick}
                    className="!bg-green-500 !border-green-500 hover:!bg-green-600 !h-10 !px-6"
                >
                    Tạo vòng đấu giá
                </Button>
            </div>
        </div>
    );
};

export default PageHeader;
