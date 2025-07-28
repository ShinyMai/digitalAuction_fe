import React, { useState } from 'react';
import {
    Table,
    Card,
    Modal,
    List,
    Avatar,
    Button,
    Typography,
    Statistic,
    Row,
    Col,
    Badge,
    Empty,
    message,
    Tag
} from 'antd';
import {
    EyeOutlined,
    UserOutlined,
    TrophyOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    HomeOutlined,
    DollarOutlined,
    CrownOutlined,
    TeamOutlined,
    IdcardOutlined,
    EnvironmentOutlined,
    CheckOutlined
} from '@ant-design/icons';
import type { AuctionRoundPrice } from '../modalsData';

const { Title, Text } = Typography;

interface AssetAnalysis {
    tagName: string;
    totalBidders: number;
    uniqueBidders: number;
    highestPrice: number;
    highestPriceBidders: number;
    totalBids: number;
    averagePrice: number;
    priceRange: number;
    lowestPrice: number;
    competitionLevel: 'Thấp' | 'Trung bình' | 'Cao' | 'Rất cao';
}

// Định nghĩa interface cho dữ liệu highest bidder
interface HighestBidder {
    userName: string;
    citizenId: string;
    amount: number;
    bidTime: string;
    province: string;
    flagWinner: boolean; // false: Not Winner, true: Winner
}

interface AssetAnalysisTableProps {
    priceHistory: AuctionRoundPrice[];
    onUpdateWinner?: (assetName: string, citizenId: string, flagWinner: boolean) => void;
}

const AssetAnalysisTable: React.FC<AssetAnalysisTableProps> = ({
    priceHistory,
    onUpdateWinner
}) => {
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Lấy danh sách người trả giá cao nhất cho mỗi tài sản
    const getHighestBiddersForAsset = (assetName: string): HighestBidder[] => {
        const assetBids = priceHistory.filter(bid => bid.tagName === assetName);

        if (assetBids.length === 0) return [];

        // Tìm giá cao nhất - sử dụng auctionPrice từ AuctionRoundPrice
        const maxPrice = Math.max(...assetBids.map(bid => bid.auctionPrice));

        // Lấy tất cả người trả giá cao nhất
        const highestBidders = assetBids
            .filter(bid => bid.auctionPrice === maxPrice)
            .map(bid => ({
                userName: bid.userName,
                citizenId: bid.citizenIdentification,
                amount: bid.auctionPrice,
                bidTime: new Date().toLocaleString('vi-VN'), // Không có CreateDate trong type
                province: bid.recentLocation, // Sử dụng recentLocation thay vì Province
                flagWinner: bid.flagWinner || false // Từ backend data
            }));

        return highestBidders;
    };

    // Phân tích dữ liệu cho từng tài sản
    const getAssetAnalysis = (): AssetAnalysis[] => {
        const assets = [...new Set(priceHistory.map(bid => bid.tagName))];

        return assets.map(assetName => {
            const assetBids = priceHistory.filter(bid => bid.tagName === assetName);
            const prices = assetBids.map(bid => bid.auctionPrice);
            const uniqueBidders = new Set(assetBids.map(bid => bid.citizenIdentification));

            const highestPrice = Math.max(...prices);
            const lowestPrice = Math.min(...prices);
            const averagePrice = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;
            const highestPriceBidders = assetBids.filter(bid => bid.auctionPrice === highestPrice).length;

            // Xác định mức độ cạnh tranh
            let competitionLevel: 'Thấp' | 'Trung bình' | 'Cao' | 'Rất cao' = 'Thấp';
            if (uniqueBidders.size >= 20) competitionLevel = 'Rất cao';
            else if (uniqueBidders.size >= 15) competitionLevel = 'Cao';
            else if (uniqueBidders.size >= 10) competitionLevel = 'Trung bình';

            return {
                tagName: assetName as string,
                totalBidders: uniqueBidders.size,
                uniqueBidders: uniqueBidders.size,
                highestPrice,
                highestPriceBidders,
                totalBids: assetBids.length,
                averagePrice,
                priceRange: highestPrice - lowestPrice,
                lowestPrice,
                competitionLevel
            };
        }).sort((a, b) => b.highestPrice - a.highestPrice);
    };

    // Xác nhận/hủy xác nhận người chiến thắng - cập nhật flagWinner
    const confirmWinner = (assetName: string, citizenId: string, userName: string) => {
        // Tìm bid record của người này cho tài sản này
        const targetBid = priceHistory.find(bid =>
            bid.tagName === assetName && bid.citizenIdentification === citizenId
        );

        if (!targetBid) return;

        const currentFlag = targetBid.flagWinner || false;
        const newFlag = !currentFlag;

        // Nếu đang xác nhận winner mới (newFlag = true), hủy winner cũ của tài sản này
        if (newFlag) {
            priceHistory.forEach(bid => {
                if (bid.tagName === assetName && bid.citizenIdentification !== citizenId) {
                    bid.flagWinner = false;
                }
            });
        }

        // Cập nhật flag cho người được chọn
        targetBid.flagWinner = newFlag;

        // Callback để parent component có thể sync với backend
        if (onUpdateWinner) {
            onUpdateWinner(assetName, citizenId, newFlag);
        }

        if (newFlag) {
            message.success(`Đã xác nhận ${userName} là người chiến thắng cho tài sản ${assetName}`);
        } else {
            message.success(`Đã hủy xác nhận ${userName} cho tài sản ${assetName}`);
        }

        // Force re-render
        setModalVisible(false);
        setTimeout(() => setModalVisible(true), 100);
    };

    // Kiểm tra xem người này có phải người chiến thắng không dựa trên flagWinner
    const isWinner = (assetName: string, citizenId: string) => {
        const bid = priceHistory.find(bid =>
            bid.tagName === assetName && bid.citizenIdentification === citizenId
        );
        return bid?.flagWinner === true;
    };

    const showAssetDetail = (assetName: string) => {
        setSelectedAsset(assetName);
        setModalVisible(true);
    };

    const getCompetitionColor = (level: string) => {
        switch (level) {
            case 'Rất cao': return 'red';
            case 'Cao': return 'orange';
            case 'Trung bình': return 'blue';
            default: return 'default';
        }
    };

    const assetAnalyses = getAssetAnalysis();

    const columns = [
        {
            title: <span className="!font-semibold">Tài sản</span>,
            dataIndex: 'tagName',
            key: 'tagName',
            width: 200,
            render: (text: string) => (
                <div className="!flex !items-center !gap-2">
                    <HomeOutlined className="!text-blue-500" />
                    <span className="!font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: <span className="!font-semibold">Số người tham gia</span>,
            dataIndex: 'totalBidders',
            key: 'totalBidders',
            align: 'center' as const,
            render: (value: number) => (
                <div className="!flex !items-center !justify-center !gap-1">
                    <UserOutlined className="!text-green-500" />
                    <span className="!font-medium !text-green-600">{value}</span>
                </div>
            ),
        },
        {
            title: <span className="!font-semibold">Giá cao nhất</span>,
            dataIndex: 'highestPrice',
            key: 'highestPrice',
            align: 'center' as const,
            render: (value: number) => (
                <div className="!flex !items-center !justify-center !gap-1">
                    <CrownOutlined className="!text-yellow-500" />
                    <span className="!font-semibold !text-red-600">{formatPrice(value)}</span>
                </div>
            ),
        },
        {
            title: <span className="!font-semibold">Người trả giá cao nhất</span>,
            dataIndex: 'highestPriceBidders',
            key: 'highestPriceBidders',
            align: 'center' as const,
            render: (value: number) => (
                <Badge count={value} color="#52c41a" className="!font-medium">
                    <TeamOutlined className="!text-lg !text-blue-500" />
                </Badge>
            ),
        },
        {
            title: <span className="!font-semibold">Mức cạnh tranh</span>,
            dataIndex: 'competitionLevel',
            key: 'competitionLevel',
            align: 'center' as const,
            render: (level: string) => (
                <Tag color={getCompetitionColor(level)} className="!font-medium">
                    <TrophyOutlined className="!mr-1" />
                    {level}
                </Tag>
            ),
        },
        {
            title: <span className="!font-semibold">Thao tác</span>,
            key: 'action',
            align: 'center' as const,
            render: (_: unknown, record: AssetAnalysis) => (
                <Button
                    type="primary"
                    ghost
                    icon={<EyeOutlined />}
                    onClick={() => showAssetDetail(record.tagName)}
                    className="!border-blue-400 !text-blue-600 hover:!bg-blue-50"
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    const selectedAssetAnalysis = assetAnalyses.find(analysis => analysis.tagName === selectedAsset);
    const highestBidders = selectedAsset ? getHighestBiddersForAsset(selectedAsset) : [];

    return (
        <div className="!w-full">
            {/* Summary Statistics - Moved to top */}
            <div className="!mb-6">
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Card className="!text-center !bg-blue-50">
                            <Statistic
                                title="Tổng số tài sản"
                                value={assetAnalyses.length}
                                prefix={<HomeOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="!text-center !bg-green-50">
                            <Statistic
                                title="Tổng lượt đấu giá"
                                value={assetAnalyses.reduce((sum, asset) => sum + asset.totalBids, 0)}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="!text-center !bg-yellow-50">
                            <Statistic
                                title="Tổng người tham gia"
                                value={assetAnalyses.reduce((sum, asset) => sum + asset.uniqueBidders, 0)}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="!text-center !bg-red-50">
                            <Statistic
                                title="Giá trị cao nhất"
                                value={assetAnalyses.length > 0 ? Math.max(...assetAnalyses.map(a => a.highestPrice)) : 0}
                                prefix={<CrownOutlined />}
                                valueStyle={{ color: '#f5222d' }}
                                formatter={(value) => formatPrice(Number(value))}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <Card
                title={
                    <div className="!flex !items-center !gap-2">
                        <DollarOutlined className="!text-blue-500" />
                        <span className="!text-lg !font-semibold">Phân tích chi tiết tài sản</span>
                    </div>
                }
                className="!shadow-lg"
            >
                <Table
                    columns={columns}
                    dataSource={assetAnalyses}
                    rowKey="tagName"
                    pagination={false}
                    className="!mt-4"
                    size="middle"
                />
            </Card>

            {/* Modal xem chi tiết người trả giá cao nhất */}
            <Modal
                title={
                    <div className="!flex !items-center !gap-2 !text-lg">
                        <TrophyOutlined className="!text-yellow-500" />
                        <span>Danh sách người trả giá cao nhất - {selectedAsset}</span>
                    </div>
                }
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                width={800}
                footer={null}
                className="!top-6"
            >
                {selectedAssetAnalysis && (
                    <>
                        {/* Thông tin tổng quan */}
                        <Card className="!mb-4 !bg-gray-50">
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <Text strong>Giá cao nhất: </Text>
                                    <Text className="!text-red-600 !font-semibold">
                                        {formatPrice(selectedAssetAnalysis.highestPrice)}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Số người trả giá cao nhất: </Text>
                                    <Text className="!text-blue-600 !font-semibold">
                                        {selectedAssetAnalysis.highestPriceBidders} người
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Mức độ cạnh tranh: </Text>
                                    <Tag color={getCompetitionColor(selectedAssetAnalysis.competitionLevel)}>
                                        {selectedAssetAnalysis.competitionLevel}
                                    </Tag>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Tổng lượt đấu giá: </Text>
                                    <Text className="!text-green-600 !font-semibold">
                                        {selectedAssetAnalysis.totalBids} lượt
                                    </Text>
                                </Col>
                            </Row>
                        </Card>

                        {/* Danh sách người trả giá cao nhất */}
                        <Title level={5} className="!mb-3 !flex !items-center !gap-2">
                            <UserOutlined />
                            Danh sách chi tiết ({highestBidders.length} người)
                        </Title>

                        {highestBidders.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={highestBidders}
                                className="!max-h-96 !overflow-y-auto"
                                renderItem={(bidder, index) => {
                                    const isCurrentWinner = isWinner(selectedAsset!, bidder.citizenId);

                                    return (
                                        <List.Item
                                            className={`!p-4 !border !rounded-lg !mb-2 ${isCurrentWinner ? '!bg-green-50 !border-green-300' : '!bg-white !border-gray-200'
                                                }`}
                                            actions={[
                                                <Button
                                                    key="confirm"
                                                    type={isCurrentWinner ? "default" : "primary"}
                                                    icon={isCurrentWinner ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                                                    onClick={() => confirmWinner(selectedAsset!, bidder.citizenId, bidder.userName)}
                                                    className={isCurrentWinner ?
                                                        "!border-red-400 !text-red-600 hover:!bg-red-50" :
                                                        "!bg-green-500 !border-green-500 hover:!bg-green-600"
                                                    }
                                                >
                                                    {isCurrentWinner ? 'Hủy xác nhận' : 'Xác nhận'}
                                                </Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <div className="!relative">
                                                        <Avatar
                                                            size={50}
                                                            icon={<UserOutlined />}
                                                            className={`!border-2 ${isCurrentWinner ? '!border-green-500 !bg-green-100' : '!border-gray-300'
                                                                }`}
                                                        />
                                                        {index < 3 && (
                                                            <div className={`!absolute !-top-1 !-right-1 !w-6 !h-6 !rounded-full !flex !items-center !justify-center !text-xs !font-bold !text-white ${index === 0 ? '!bg-yellow-500' :
                                                                index === 1 ? '!bg-gray-400' : '!bg-orange-500'
                                                                }`}>
                                                                {index + 1}
                                                            </div>
                                                        )}
                                                        {isCurrentWinner && (
                                                            <div className="!absolute !-bottom-1 !-right-1 !w-6 !h-6 !rounded-full !bg-green-500 !flex !items-center !justify-center">
                                                                <CheckOutlined className="!text-white !text-xs" />
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                                title={
                                                    <div className="!flex !items-center !gap-2">
                                                        <span className="!font-semibold !text-base">{bidder.userName}</span>
                                                        {isCurrentWinner && (
                                                            <Badge
                                                                text="Người chiến thắng"
                                                                color="green"
                                                                className="!text-green-600 !font-medium"
                                                            />
                                                        )}
                                                    </div>
                                                }
                                                description={
                                                    <div className="!space-y-1">
                                                        <div className="!flex !items-center !gap-2 !text-sm">
                                                            <IdcardOutlined className="!text-gray-500" />
                                                            <span>CCCD: {bidder.citizenId}</span>
                                                        </div>
                                                        <div className="!flex !items-center !gap-2 !text-sm">
                                                            <EnvironmentOutlined className="!text-gray-500" />
                                                            <span>{bidder.province}</span>
                                                        </div>
                                                        <div className="!flex !items-center !gap-2 !text-sm">
                                                            <span className="!text-gray-500">Thời gian:</span>
                                                            <span>{bidder.bidTime}</span>
                                                        </div>
                                                        <div className="!flex !items-center !gap-2">
                                                            <DollarOutlined className="!text-green-500" />
                                                            <span className="!font-semibold !text-green-600 !text-base">
                                                                {formatPrice(bidder.amount)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    );
                                }}
                            />
                        ) : (
                            <Empty
                                description="Chưa có ai trả giá cho tài sản này"
                                className="!py-8"
                            />
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
};

export default AssetAnalysisTable;