import React from 'react';
import { Card, Statistic, Progress } from 'antd';
import {
    TrophyOutlined,
    TeamOutlined,
    DollarOutlined,
    RiseOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    FireOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import type { RoundDetailStats } from '../types';

interface StatsOverviewProps {
    stats: RoundDetailStats;
    loading?: boolean;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, loading }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const calculateBidRange = () => {
        const range = stats.highestBid - stats.lowestBid;
        const percentage = range > 0 ? ((stats.averageBid - stats.lowestBid) / range) * 100 : 0;
        return percentage;
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <Card key={index} className="!border-0 !shadow-lg animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tổng số lượt trả giá */}
            <Card className="!border-0 !shadow-lg !bg-gradient-to-br !from-blue-50 !to-blue-100 hover:!shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-blue-600 text-sm font-medium mb-1">Tổng lượt trả giá</p>
                        <Statistic
                            value={stats.totalBids}
                            valueStyle={{
                                color: '#2563eb',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                margin: 0
                            }}
                        />
                        <p className="text-xs text-blue-500 mt-1">
                            {stats.uniqueBidders} người tham gia
                        </p>
                    </div>
                    <div className="bg-blue-500 rounded-full p-4">
                        <FireOutlined className="text-white text-2xl" />
                    </div>
                </div>
            </Card>

            {/* Giá cao nhất */}
            <Card className="!border-0 !shadow-lg !bg-gradient-to-br !from-green-50 !to-green-100 hover:!shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-green-600 text-sm font-medium mb-1">Giá cao nhất</p>
                        <Statistic
                            value={stats.highestBid}
                            formatter={(value) => formatCurrency(value as number)}
                            valueStyle={{
                                color: '#16a34a',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                margin: 0
                            }}
                        />
                    </div>
                    <div className="bg-green-500 rounded-full p-4">
                        <TrophyOutlined className="text-white text-2xl" />
                    </div>
                </div>
            </Card>

            {/* Giá trung bình */}
            <Card className="!border-0 !shadow-lg !bg-gradient-to-br !from-purple-50 !to-purple-100 hover:!shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-purple-600 text-sm font-medium mb-1">Giá trung bình</p>
                        <Statistic
                            value={stats.averageBid}
                            formatter={(value) => formatCurrency(value as number)}
                            valueStyle={{
                                color: '#9333ea',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                margin: 0
                            }}
                        />
                        <Progress
                            percent={calculateBidRange()}
                            showInfo={false}
                            strokeColor="#9333ea"
                            className="mt-2"
                        />
                    </div>
                    <div className="bg-purple-500 rounded-full p-4">
                        <DollarOutlined className="text-white text-2xl" />
                    </div>
                </div>
            </Card>

            {/* Bước giá */}
            <Card className="!border-0 !shadow-lg !bg-gradient-to-br !from-orange-50 !to-orange-100 hover:!shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-orange-600 text-sm font-medium mb-1">Bước giá</p>
                        <Statistic
                            value={stats.bidIncrement}
                            formatter={(value) => formatCurrency(value as number)}
                            valueStyle={{
                                color: '#ea580c',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                margin: 0
                            }}
                        />
                    </div>
                    <div className="bg-orange-500 rounded-full p-4">
                        <RiseOutlined className="text-white text-2xl" />
                    </div>
                </div>
            </Card>

            {/* Số người tham gia */}
            <Card className="!border-0 !shadow-lg !bg-gradient-to-br !from-indigo-50 !to-indigo-100 hover:!shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-indigo-600 text-sm font-medium mb-1">Người tham gia</p>
                        <Statistic
                            value={stats.uniqueBidders}
                            valueStyle={{
                                color: '#4f46e5',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                margin: 0
                            }}
                        />
                        <p className="text-xs text-indigo-500 mt-1">
                            Tỷ lệ: {((stats.totalBids / stats.uniqueBidders) || 0).toFixed(1)} lượt/người
                        </p>
                    </div>
                    <div className="bg-indigo-500 rounded-full p-4">
                        <TeamOutlined className="text-white text-2xl" />
                    </div>
                </div>
            </Card>

            {/* Vị trí hàng đầu */}
            <Card className="!border-0 !shadow-lg !bg-gradient-to-br !from-pink-50 !to-pink-100 hover:!shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-pink-600 text-sm font-medium mb-1">Vị trí hàng đầu</p>
                        <div className="text-pink-700 text-xl font-bold">
                            {stats.topBidderLocation}
                        </div>
                        <p className="text-xs text-pink-500 mt-1">Nhiều bid nhất</p>
                    </div>
                    <div className="bg-pink-500 rounded-full p-4">
                        <EnvironmentOutlined className="text-white text-2xl" />
                    </div>
                </div>
            </Card>

            {/* Thời gian đầu tiên */}
            <Card className="!border-0 !shadow-lg !bg-gradient-to-br !from-cyan-50 !to-cyan-100 hover:!shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-cyan-600 text-sm font-medium mb-1">Bid đầu tiên</p>
                        <div className="text-cyan-700 text-lg font-bold">
                            {formatDateTime(stats.timeRange.firstBid)}
                        </div>
                    </div>
                    <div className="bg-cyan-500 rounded-full p-4">
                        <ClockCircleOutlined className="text-white text-2xl" />
                    </div>
                </div>
            </Card>

            {/* Tốc độ trả giá */}
            <Card className="!border-0 !shadow-lg !bg-gradient-to-br !from-yellow-50 !to-yellow-100 hover:!shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-yellow-600 text-sm font-medium mb-1">Tốc độ trả giá</p>
                        <div className="text-yellow-700 text-xl font-bold">
                            {(stats.totalBids / 25).toFixed(1)} lượt/phút
                        </div>
                        <p className="text-xs text-yellow-500 mt-1">Trong 25 phút</p>
                    </div>
                    <div className="bg-yellow-500 rounded-full p-4">
                        <ThunderboltOutlined className="text-white text-2xl" />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default StatsOverview;
