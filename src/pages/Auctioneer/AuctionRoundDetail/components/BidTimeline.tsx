import React from 'react';
import { Card, Timeline, Typography, Tag, Avatar } from 'antd';
import {
    ClockCircleOutlined,
    TrophyOutlined,
    RiseOutlined,
    UserOutlined,
    FireOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import type { ExtendedAuctionRoundPrice, TimelineEvent } from '../types';

const { Text } = Typography;

interface BidTimelineProps {
    bids: ExtendedAuctionRoundPrice[];
    loading?: boolean;
}

const BidTimeline: React.FC<BidTimelineProps> = ({ bids, loading }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const generateTimelineEvents = (): TimelineEvent[] => {
        const events: TimelineEvent[] = [];
        const sortedBids = [...bids].sort((a, b) =>
            new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
        );

        // Add start milestone
        if (sortedBids.length > 0) {
            events.push({
                id: 'start',
                time: sortedBids[0].CreatedAt,
                type: 'milestone',
                description: 'Vòng đấu giá bắt đầu',
                icon: <FireOutlined />
            });
        }

        // Add bid events
        sortedBids.forEach((bid, index) => {
            const isNewRecord = index === 0 || bid.AuctionPrice > sortedBids[index - 1].AuctionPrice;

            events.push({
                id: bid.AuctionRoundPriceId,
                time: bid.CreatedAt,
                type: 'bid',
                user: bid.UserName,
                amount: bid.AuctionPrice,
                description: isNewRecord ? 'Kỷ lục mới!' : 'Trả giá',
                icon: isNewRecord ? <TrophyOutlined /> : <RiseOutlined />
            });

            // Add milestone for every 5 bids
            if ((index + 1) % 5 === 0) {
                events.push({
                    id: `milestone-${index}`,
                    time: bid.CreatedAt,
                    type: 'milestone',
                    description: `Đã có ${index + 1} lượt trả giá`,
                    icon: <ThunderboltOutlined />
                });
            }
        });

        return events.sort((a, b) =>
            new Date(a.time).getTime() - new Date(b.time).getTime()
        );
    };

    const getTimelineColor = (event: TimelineEvent, index: number) => {
        if (event.type === 'milestone') {
            return '#8b5cf6'; // Purple for milestones
        }

        if (event.description === 'Kỷ lục mới!') {
            return '#f59e0b'; // Gold for records
        }

        // Gradient colors for bids
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
        return colors[index % colors.length];
    };

    const timelineEvents = generateTimelineEvents();

    if (loading) {
        return (
            <Card className="!border-0 !shadow-lg">
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="animate-pulse flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card
            className="!border-0 !shadow-lg !bg-gradient-to-br !from-white !to-purple-50"
            title={
                <div className="flex items-center space-x-2">
                    <ClockCircleOutlined className="text-purple-500 text-xl" />
                    <span className="text-xl font-bold text-gray-800">Timeline Trả Giá</span>
                </div>
            }
        >
            {timelineEvents.length > 0 ? (
                <Timeline
                    mode="left"
                    className="!mt-4"
                    items={timelineEvents.map((event, index) => ({
                        color: getTimelineColor(event, index),
                        dot: (
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg
                  ${event.type === 'milestone' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : ''}
                  ${event.description === 'Kỷ lục mới!' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : ''}
                  ${event.type === 'bid' && event.description !== 'Kỷ lục mới!' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : ''}
                `}
                            >
                                {event.icon}
                            </div>
                        ),
                        children: (
                            <div className={`
                p-4 rounded-xl border-l-4 ml-4 transition-all duration-300 hover:shadow-md
                ${event.type === 'milestone' ? 'bg-purple-50 border-purple-500' : ''}
                ${event.description === 'Kỷ lục mới!' ? 'bg-yellow-50 border-yellow-500' : ''}
                ${event.type === 'bid' && event.description !== 'Kỷ lục mới!' ? 'bg-blue-50 border-blue-500' : ''}
              `}>
                                {/* Time */}
                                <div className="flex items-center justify-between mb-2">
                                    <Text className="text-xs text-gray-500 font-medium">
                                        {formatTime(event.time)}
                                    </Text>
                                    {event.description === 'Kỷ lục mới!' && (
                                        <Tag color="gold" className="!border-yellow-400 !text-yellow-700">
                                            <TrophyOutlined className="mr-1" />
                                            KỶ LỤC
                                        </Tag>
                                    )}
                                </div>

                                {/* Event Content */}
                                {event.type === 'bid' ? (
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <Avatar
                                                size={32}
                                                icon={<UserOutlined />}
                                                className="!bg-gradient-to-r !from-blue-500 !to-purple-600"
                                            />
                                            <div>
                                                <Text strong className="text-gray-800">
                                                    {event.user}
                                                </Text>
                                                <div className="text-xs text-gray-500">
                                                    {event.description}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`
                      text-right p-3 rounded-lg
                      ${event.description === 'Kỷ lục mới!' ? 'bg-yellow-100' : 'bg-white'}
                    `}>
                                            <Text
                                                strong
                                                className={`
                          text-lg
                          ${event.description === 'Kỷ lục mới!' ? 'text-yellow-700' : 'text-gray-800'}
                        `}
                                            >
                                                {formatCurrency(event.amount!)}
                                            </Text>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <Text strong className="text-purple-700">
                                            {event.description}
                                        </Text>
                                        <div className="text-xs text-purple-600 mt-1">
                                            Cột mốc quan trọng trong cuộc đấu giá
                                        </div>
                                    </div>
                                )}
                            </div>
                        ),
                        label: (
                            <div className="text-right mr-4">
                                <div className="text-xs text-gray-400">
                                    {new Date(event.time).toLocaleTimeString('vi-VN')}
                                </div>
                            </div>
                        )
                    }))}
                />
            ) : (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ClockCircleOutlined className="text-gray-400 text-2xl" />
                    </div>
                    <Text className="text-gray-500">Chưa có hoạt động trả giá</Text>
                </div>
            )}
        </Card>
    );
};

export default BidTimeline;
