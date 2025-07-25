import React from 'react';
import { Statistic } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    RiseOutlined
} from '@ant-design/icons';
import type { RoundStatss } from '../types';

interface RoundStatsProps {
    stats: RoundStatss;
    loading?: boolean;
}

const AuctionRoundStats: React.FC<RoundStatsProps> = ({ stats, loading }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Tổng số vòng */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium mb-1">Tổng số vòng</p>
                            <Statistic
                                value={stats.totalRounds}
                                valueStyle={{
                                    color: '#2563eb',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: 0
                                }}
                            />
                        </div>
                        <div className="bg-blue-500 rounded-full p-3">
                            <ClockCircleOutlined className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                {/* Vòng đã hoàn thành */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium mb-1">Vòng đã hoàn thành</p>
                            <Statistic
                                value={stats.completedRounds}
                                valueStyle={{
                                    color: '#16a34a',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: 0
                                }}
                            />
                        </div>
                        <div className="bg-green-500 rounded-full p-3">
                            <CheckCircleOutlined className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                {/* Số người tham gia */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium mb-1">Số người tham gia</p>
                            <Statistic
                                value={stats.totalParticipants}
                                valueStyle={{
                                    color: '#9333ea',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: 0
                                }}
                            />
                        </div>
                        <div className="bg-purple-500 rounded-full p-3">
                            <TeamOutlined className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                {/* Tăng giá trung bình */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 text-sm font-medium mb-1">Tăng giá trung bình</p>
                            <Statistic
                                value={stats.averagePriceIncrease}
                                formatter={(value) => formatCurrency(value as number)}
                                valueStyle={{
                                    color: '#ea580c',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    margin: 0
                                }}
                            />
                        </div>
                        <div className="bg-orange-500 rounded-full p-3">
                            <RiseOutlined className="text-white text-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionRoundStats;
