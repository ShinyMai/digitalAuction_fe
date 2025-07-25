import React from 'react';
import { Card, Avatar, Progress, Typography } from 'antd';
import {
    TrophyOutlined,
    UserOutlined,
    EnvironmentOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    RiseOutlined
} from '@ant-design/icons';
import type { BidderInfo } from '../types';

const { Text } = Typography;

interface TopBiddersProps {
    bidders: BidderInfo[];
    loading?: boolean;
}

const TopBidders: React.FC<TopBiddersProps> = ({ bidders, loading }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getProgressColor = (index: number) => {
        const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];
        return colors[index % colors.length];
    };

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <TrophyOutlined className="text-yellow-500 text-lg" />;
            case 1:
                return <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">2</div>;
            case 2:
                return <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold">3</div>;
            default:
                return <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">{index + 1}</div>;
        }
    };

    if (loading) {
        return (
            <Card className="!border-0 !shadow-lg !bg-white">
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card
            className="!border-0 !shadow-lg !bg-gradient-to-br !from-white !to-blue-50"
            title={
                <div className="flex items-center space-x-2">
                    <TrophyOutlined className="text-yellow-500 text-xl" />
                    <span className="text-xl font-bold text-gray-800">Top Bidders</span>
                </div>
            }
        >
            <div className="space-y-4">
                {bidders.map((bidder, index) => (
                    <div
                        key={bidder.citizenId}
                        className={`
              relative p-4 rounded-xl border transition-all duration-300 hover:shadow-md
              ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200' : ''}
              ${index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200' : ''}
              ${index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200' : ''}
              ${index >= 3 ? 'bg-white border-gray-200' : ''}
            `}
                    >
                        {/* Rank Indicator */}
                        <div className="absolute top-4 right-4">
                            {getRankIcon(index)}
                        </div>

                        <div className="flex items-start space-x-4 pr-8">
                            {/* Avatar */}
                            <div className="relative">
                                <Avatar
                                    size={48}
                                    icon={<UserOutlined />}
                                    className={`
                    !text-white
                    ${index === 0 ? '!bg-gradient-to-r !from-yellow-400 !to-yellow-600' : ''}
                    ${index === 1 ? '!bg-gradient-to-r !from-gray-400 !to-gray-600' : ''}
                    ${index === 2 ? '!bg-gradient-to-r !from-orange-400 !to-orange-600' : ''}
                    ${index >= 3 ? '!bg-gradient-to-r !from-blue-400 !to-blue-600' : ''}
                  `}
                                />
                                {index === 0 && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <TrophyOutlined className="text-white text-xs" />
                                    </div>
                                )}
                            </div>

                            {/* Bidder Info */}
                            <div className="flex-1 min-w-0">
                                {/* Name and ID */}
                                <div className="flex items-center space-x-2 mb-2">
                                    <Text strong className="text-gray-800 text-lg truncate">
                                        {bidder.userName}
                                    </Text>
                                    {index < 3 && (
                                        <div className={`
                      px-2 py-1 rounded-full text-xs font-bold text-white
                      ${index === 0 ? 'bg-yellow-500' : ''}
                      ${index === 1 ? 'bg-gray-500' : ''}
                      ${index === 2 ? 'bg-orange-500' : ''}
                    `}>
                                            #{index + 1}
                                        </div>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="flex items-center space-x-2 mb-3">
                                    <EnvironmentOutlined className="text-gray-500 text-sm" />
                                    <Text className="text-gray-600 text-sm">{bidder.location}</Text>
                                    <span className="text-gray-400">•</span>
                                    <Text className="text-gray-500 text-xs">ID: {bidder.citizenId}</Text>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {/* Highest Bid */}
                                    <div className="bg-white/70 rounded-lg p-3">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <DollarOutlined className="text-green-500 text-sm" />
                                            <Text className="text-xs text-gray-500">Giá cao nhất</Text>
                                        </div>
                                        <Text strong className="text-green-600 text-sm">
                                            {formatCurrency(bidder.highestBid)}
                                        </Text>
                                    </div>

                                    {/* Total Bids */}
                                    <div className="bg-white/70 rounded-lg p-3">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <RiseOutlined className="text-blue-500 text-sm" />
                                            <Text className="text-xs text-gray-500">Số lượt</Text>
                                        </div>
                                        <Text strong className="text-blue-600 text-sm">
                                            {bidder.totalBids} lượt
                                        </Text>
                                    </div>
                                </div>

                                {/* Average Bid with Progress */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Text className="text-xs text-gray-500">Giá trung bình:</Text>
                                        <Text strong className="text-xs text-gray-700">
                                            {formatCurrency(bidder.averageBid)}
                                        </Text>
                                    </div>
                                    <Progress
                                        percent={Math.min((bidder.averageBid / bidder.highestBid) * 100, 100)}
                                        showInfo={false}
                                        strokeColor={getProgressColor(index)}
                                        trailColor="#f3f4f6"
                                        size="small"
                                    />
                                </div>

                                {/* Last Bid Time */}
                                <div className="flex items-center space-x-2">
                                    <ClockCircleOutlined className="text-gray-400 text-xs" />
                                    <Text className="text-xs text-gray-500">
                                        Lần cuối: {new Date(bidder.bidTimes[bidder.bidTimes.length - 1]).toLocaleString('vi-VN')}
                                    </Text>
                                </div>
                            </div>
                        </div>

                        {/* Winning Indicator */}
                        {index === 0 && (
                            <div className="absolute inset-0 rounded-xl border-2 border-yellow-400 pointer-events-none">
                                <div className="absolute -top-2 left-4 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                                    ĐANG DẪN ĐẦU
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {bidders.length === 0 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserOutlined className="text-gray-400 text-2xl" />
                        </div>
                        <Text className="text-gray-500">Chưa có người trả giá</Text>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TopBidders;
