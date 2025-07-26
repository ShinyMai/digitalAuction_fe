import { Table, Card, Typography, Tag, Empty } from "antd";
import { UserOutlined, IdcardOutlined, EnvironmentOutlined, DollarOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AuctionRoundPrice } from "../../Modals";

const { Title } = Typography;

interface PriceHistoryTableProps {
    priceHistory: AuctionRoundPrice[];
}

const PriceHistoryTable = ({ priceHistory }: PriceHistoryTableProps) => {
    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(parseInt(price));
    };

    type DataType = AuctionRoundPrice & { key: number };

    const columns: ColumnsType<DataType> = [
        {
            title: (
                <span className="flex items-center gap-2">
                    <DollarOutlined />
                    Tên tài sản
                </span>
            ),
            dataIndex: 'TagName',
            key: 'TagName',
            render: (text: string) => (
                <Tag color="blue" className="!text-sm !py-1 !px-3">
                    {text}
                </Tag>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <UserOutlined />
                    Người đấu giá
                </span>
            ),
            dataIndex: 'UserName',
            key: 'UserName',
            render: (text: string) => (
                <span className="!font-medium !text-gray-900">{text}</span>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <IdcardOutlined />
                    CCCD
                </span>
            ),
            dataIndex: 'CitizenIdentification',
            key: 'CitizenIdentification',
            render: (text: string) => (
                <span className="!font-mono !text-gray-600">{text}</span>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <EnvironmentOutlined />
                    Địa điểm
                </span>
            ),
            dataIndex: 'RecentLocation',
            key: 'RecentLocation',
            render: (text: string) => (
                <Tag color="green">{text}</Tag>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <DollarOutlined />
                    Giá trả
                </span>
            ),
            dataIndex: 'AuctionPrice',
            key: 'AuctionPrice',
            render: (price: string) => (
                <span className="!font-bold !text-green-600 !text-lg">
                    {formatPrice(price)}
                </span>
            ),
            sorter: (a: DataType, b: DataType) =>
                parseInt(a.AuctionPrice) - parseInt(b.AuctionPrice),
            sortDirections: ['ascend', 'descend'],
        },
    ];

    return (
        <Card className="!shadow-md">
            <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                <DollarOutlined className="!text-blue-500" />
                Lịch sử trả giá
            </Title>

            <Table<DataType>
                columns={columns}
                dataSource={priceHistory.map((item, index) => ({
                    ...item,
                    key: index,
                }))}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} lượt đấu giá`,
                }}
                locale={{
                    emptyText: (
                        <Empty
                            description="Chưa có lượt đấu giá nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ),
                }}
                scroll={{ x: 800 }}
                size="middle"
                className="custom-table"
            />
        </Card>
    );
};

export default PriceHistoryTable;
