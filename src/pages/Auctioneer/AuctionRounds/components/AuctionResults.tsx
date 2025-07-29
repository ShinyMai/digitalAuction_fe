import { Card, Table, Typography, Statistic, Tag, Space, Avatar, Badge, Button } from "antd";
import {
    TrophyOutlined,
    UserOutlined,
    DollarOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    StarOutlined,
    CrownOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import type { AuctionRoundPriceWinner } from "../modalsData";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface AuctionResultsProps {
    auctionRoundPriceWinners: AuctionRoundPriceWinner[];
    onBack: () => void;
}

const AuctionResults = ({ auctionRoundPriceWinners, onBack }: AuctionResultsProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate statistics
    const totalWinners = auctionRoundPriceWinners.filter(item => item.flagWinner).length;
    const totalAssets = new Set(auctionRoundPriceWinners.map(item => item.tagName)).size;
    const totalValue = auctionRoundPriceWinners
        .filter(item => item.flagWinner)
        .reduce((sum, item) => sum + item.auctionPrice, 0);
    const averagePrice = totalWinners > 0 ? totalValue / totalWinners : 0;

    // Get winners only
    const winners = auctionRoundPriceWinners.filter(item => item.flagWinner);

    // Table columns
    const columns: ColumnsType<AuctionRoundPriceWinner> = [
        {
            title: 'Xếp hạng',
            key: 'rank',
            width: 80,
            render: (_, __, index) => (
                <div className="text-center">
                    {index === 0 && (
                        <Badge.Ribbon text="TOP 1" color="gold">
                            <Avatar
                                size={40}
                                className="bg-yellow-500 text-white font-bold"
                                icon={<CrownOutlined />}
                            />
                        </Badge.Ribbon>
                    )}
                    {index === 1 && (
                        <Avatar
                            size={36}
                            className="bg-gray-400 text-white font-bold"
                        >
                            {index + 1}
                        </Avatar>
                    )}
                    {index === 2 && (
                        <Avatar
                            size={36}
                            className="bg-orange-500 text-white font-bold"
                        >
                            {index + 1}
                        </Avatar>
                    )}
                    {index > 2 && (
                        <Avatar
                            size={32}
                            className="bg-blue-500 text-white font-bold"
                        >
                            {index + 1}
                        </Avatar>
                    )}
                </div>
            ),
        },
        {
            title: 'Người thắng cuộc',
            dataIndex: 'userName',
            key: 'userName',
            render: (text, record) => (
                <Space direction="vertical" size="small">
                    <Text strong className="text-lg">{text}</Text>
                    <Text type="secondary" className="text-sm">
                        CCCD: {record.citizenIdentification}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Tài sản',
            dataIndex: 'tagName',
            key: 'tagName',
            render: (text) => (
                <Tag color="blue" className="text-sm font-medium px-3 py-1">
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Giá thắng cuộc',
            dataIndex: 'auctionPrice',
            key: 'auctionPrice',
            render: (price) => (
                <Text strong className="text-lg text-green-600">
                    {formatCurrency(price)}
                </Text>
            ),
            sorter: (a, b) => a.auctionPrice - b.auctionPrice,
        },
        {
            title: 'Địa điểm',
            dataIndex: 'recentLocation',
            key: 'recentLocation',
            render: (location) => (
                <Space>
                    <EnvironmentOutlined className="text-gray-500" />
                    <Text>{location}</Text>
                </Space>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <Space>
                    <CalendarOutlined className="text-gray-500" />
                    <Text className="text-sm">{formatDate(date)}</Text>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <Card className="!mb-6 shadow-sm border-0 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <TrophyOutlined className="text-3xl text-yellow-500" />
                        <div>
                            <Title level={2} className="!mb-1 !text-gray-800">
                                Kết quả đấu giá
                            </Title>
                            <Text type="secondary" className="text-base">
                                Danh sách người thắng cuộc và thống kê tổng quan
                            </Text>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        icon={<ArrowLeftOutlined />}
                        onClick={onBack}
                        className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !border-none !shadow-lg hover:!from-blue-600 hover:!to-blue-700 !transition-all !duration-300 !h-12 !px-8"
                    >
                        Quay lại
                    </Button>
                </div>
            </Card>

            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Tổng số người thắng</span>}
                        value={totalWinners}
                        prefix={<UserOutlined className="text-green-500" />}
                        valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Tài sản được bán</span>}
                        value={totalAssets}
                        prefix={<HomeOutlined className="text-blue-500" />}
                        valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Tổng giá trị</span>}
                        value={formatCurrency(totalValue)}
                        prefix={<DollarOutlined className="text-purple-500" />}
                        valueStyle={{ color: '#722ed1', fontSize: '20px', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Giá trung bình</span>}
                        value={formatCurrency(averagePrice)}
                        prefix={<StarOutlined className="text-orange-500" />}
                        valueStyle={{ color: '#fa8c16', fontSize: '20px', fontWeight: 'bold' }}
                    />
                </Card>
            </div>

            {/* Winners Table */}
            <Card className="shadow-sm border-0">
                <Title level={4} className="!mb-6 !flex !items-center !gap-2 !text-gray-800">
                    <CrownOutlined className="!text-yellow-500" />
                    Danh sách người thắng cuộc
                </Title>
                <Table
                    columns={columns}
                    dataSource={winners.sort((a, b) => b.auctionPrice - a.auctionPrice)}
                    rowKey="auctionRoundPriceId"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} người thắng cuộc`,
                    }}
                    className="custom-table"
                    rowClassName={(_, index) =>
                        index === 0 ? 'bg-yellow-50' :
                            index === 1 ? 'bg-gray-50' :
                                index === 2 ? 'bg-orange-50' : ''
                    }
                />
            </Card>

            <style>{`
                .custom-table .ant-table-thead > tr > th {
                    background: #f8f9fa;
                    border-bottom: 2px solid #e9ecef;
                    font-weight: 600;
                }
                .custom-table .ant-table-tbody > tr:hover > td {
                    background: #f0f9ff;
                }
            `}</style>
        </div>
    );
};

export default AuctionResults;
