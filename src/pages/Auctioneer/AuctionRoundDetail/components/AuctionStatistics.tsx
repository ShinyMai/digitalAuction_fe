import { Card, Row, Col, Statistic, Typography, List, Avatar } from "antd";
import {
    BarChartOutlined,
    UserOutlined,
    DollarOutlined,
    HomeOutlined,
    RiseOutlined,
    FallOutlined,
    LineChartOutlined,
    TrophyOutlined,
    FireOutlined,
    PercentageOutlined,
} from "@ant-design/icons";
import type { AuctionRoundPrice } from "../../Modals";

const { Title } = Typography;

interface AuctionStatisticsProps {
    priceHistory: AuctionRoundPrice[];
}

const AuctionStatistics = ({ priceHistory }: AuctionStatisticsProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Tính toán các thống kê
    const totalBids = priceHistory.length;
    const uniqueBidders = new Set(priceHistory.map(item => item.CitizenIdentification)).size;
    const uniqueAssets = new Set(priceHistory.map(item => item.TagName)).size;

    const prices = priceHistory.map(item => parseInt(item.AuctionPrice));
    const totalValue = prices.reduce((sum, price) => sum + price, 0);
    const averagePrice = prices.length > 0 ? totalValue / prices.length : 0;
    const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

    // Thống kê về giá bổ sung
    const priceRange = highestPrice - lowestPrice;
    const averageBidsPerPerson = uniqueBidders > 0 ? totalBids / uniqueBidders : 0;
    const averageBidsPerAsset = uniqueAssets > 0 ? totalBids / uniqueAssets : 0;

    // Thống kê tài sản theo giá cao nhất
    const assetPriceMap = priceHistory.reduce((acc, item) => {
        const currentPrice = parseInt(item.AuctionPrice);
        if (!acc[item.TagName] || currentPrice > acc[item.TagName].price) {
            acc[item.TagName] = {
                price: currentPrice,
                name: item.TagName,
                bidCount: 0
            };
        }
        return acc;
    }, {} as Record<string, { price: number; name: string; bidCount: number }>);

    // Đếm số lượt đấu cho mỗi tài sản
    const assetBidCount = priceHistory.reduce((acc, item) => {
        acc[item.TagName] = (acc[item.TagName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Cập nhật bidCount cho mỗi tài sản
    Object.keys(assetPriceMap).forEach(assetName => {
        assetPriceMap[assetName].bidCount = assetBidCount[assetName] || 0;
    });

    const topAssetsByPrice = Object.values(assetPriceMap)
        .sort((a, b) => b.price - a.price)
        .slice(0, 3);

    const topAssetsByBids = Object.entries(assetBidCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, count]) => ({
            name,
            bidCount: count,
            price: assetPriceMap[name]?.price || 0
        }));



    return (
        <div className="!space-y-6">
            {/* Thống kê tổng quan */}
            <Card>
                <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                    <BarChartOutlined className="!text-blue-500" />
                    Thống kê tổng quan
                </Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Tổng số lượt đấu"
                            value={totalBids}
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Số người tham gia"
                            value={uniqueBidders}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Số tài sản"
                            value={uniqueAssets}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Giá trung bình"
                            value={averagePrice}
                            prefix={<DollarOutlined />}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Giá cao nhất"
                            value={highestPrice}
                            prefix={<RiseOutlined />}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#f5222d' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Giá thấp nhất"
                            value={lowestPrice}
                            prefix={<FallOutlined />}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#13c2c2' }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Thống kê về giá */}
            <Card>
                <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                    <LineChartOutlined className="!text-green-500" />
                    Thống kê về giá
                </Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Tổng giá trị đấu giá"
                            value={totalValue}
                            prefix={<DollarOutlined />}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Biên độ dao động"
                            value={priceRange}
                            prefix={<PercentageOutlined />}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Lượt đấu TB/người"
                            value={averageBidsPerPerson}
                            precision={1}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Lượt đấu TB/tài sản"
                            value={averageBidsPerAsset}
                            precision={1}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Thống kê về tài sản */}
            <Card>
                <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                    <TrophyOutlined className="!text-purple-500" />
                    Thống kê về tài sản
                </Title>
                <Row gutter={[24, 16]}>
                    <Col xs={24} lg={12}>
                        <Title level={5} className="!mb-3 !flex !items-center !gap-2">
                            <RiseOutlined className="!text-red-500" />
                            Top 3 tài sản giá cao nhất
                        </Title>
                        <List
                            itemLayout="horizontal"
                            dataSource={topAssetsByPrice}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                className={`!w-10 !h-10 !flex !items-center !justify-center !text-white !font-bold ${index === 0 ? '!bg-yellow-500' :
                                                    index === 1 ? '!bg-gray-400' : '!bg-orange-500'
                                                    }`}
                                            >
                                                {index + 1}
                                            </Avatar>
                                        }
                                        title={
                                            <div className="!flex !items-center !justify-between">
                                                <span className="!font-medium !text-gray-900">{item.name}</span>
                                                <span className="!font-bold !text-red-600">
                                                    {formatPrice(item.price)}
                                                </span>
                                            </div>
                                        }
                                        description={`${item.bidCount} lượt đấu giá`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <Title level={5} className="!mb-3 !flex !items-center !gap-2">
                            <FireOutlined className="!text-blue-500" />
                            Top 3 tài sản nhiều lượt đấu
                        </Title>
                        <List
                            itemLayout="horizontal"
                            dataSource={topAssetsByBids}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                className={`!w-10 !h-10 !flex !items-center !justify-center !text-white !font-bold ${index === 0 ? '!bg-blue-500' :
                                                    index === 1 ? '!bg-cyan-500' : '!bg-green-500'
                                                    }`}
                                            >
                                                {index + 1}
                                            </Avatar>
                                        }
                                        title={
                                            <div className="!flex !items-center !justify-between">
                                                <span className="!font-medium !text-gray-900">{item.name}</span>
                                                <span className="!font-bold !text-blue-600">
                                                    {item.bidCount} lượt
                                                </span>
                                            </div>
                                        }
                                        description={`Giá cao nhất: ${formatPrice(item.price)}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AuctionStatistics;
