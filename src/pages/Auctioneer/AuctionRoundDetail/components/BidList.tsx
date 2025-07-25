import React, { useState } from 'react';
import { Table, Tag, Button, Input, Select, Space, Typography, Avatar, Tooltip } from 'antd';
import {
    TrophyOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    UserOutlined,
    FilterOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import type { ExtendedAuctionRoundPrice } from '../types';

const { Text } = Typography;
const { Search } = Input;

interface BidListProps {
    bids: ExtendedAuctionRoundPrice[];
    loading?: boolean;
    onRefresh?: () => void;
}

const BidList: React.FC<BidListProps> = ({ bids, loading, onRefresh }) => {
    const [filteredBids, setFilteredBids] = useState(bids);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'winning' | 'top10'>('all');

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

    const handleSearch = (value: string) => {
        setSearchText(value);
        filterBids(value, filterType);
    };

    const handleFilterChange = (type: 'all' | 'winning' | 'top10') => {
        setFilterType(type);
        filterBids(searchText, type);
    };

    const filterBids = (search: string, type: 'all' | 'winning' | 'top10') => {
        let filtered = [...bids];

        // Filter by search text
        if (search) {
            filtered = filtered.filter(bid =>
                bid.UserName.toLowerCase().includes(search.toLowerCase()) ||
                bid.CitezenIdentification.includes(search) ||
                bid.RecentLocation.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter by type
        switch (type) {
            case 'winning':
                filtered = filtered.filter(bid => bid.isWinning);
                break;
            case 'top10':
                filtered = filtered.slice(0, 10);
                break;
            default:
                break;
        }

        setFilteredBids(filtered);
    };

    const columns = [
        {
            title: 'Xếp hạng',
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            render: (rank: number, record: ExtendedAuctionRoundPrice) => (
                <div className="flex items-center justify-center">
                    {rank <= 3 ? (
                        <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
              ${rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : ''}
              ${rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : ''}
              ${rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : ''}
            `}>
                            {rank === 1 && <TrophyOutlined />}
                            {rank !== 1 && rank}
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                            {rank}
                        </div>
                    )}
                    {record.isWinning && (
                        <Tooltip title="Giá thắng">
                            <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </Tooltip>
                    )}
                </div>
            )
        },
        {
            title: 'Người trả giá',
            key: 'bidder',
            render: (record: ExtendedAuctionRoundPrice) => (
                <div className="flex items-center space-x-3">
                    <Avatar
                        icon={<UserOutlined />}
                        className="!bg-gradient-to-r !from-blue-500 !to-purple-600"
                    />
                    <div>
                        <Text strong className="text-gray-800">{record.UserName}</Text>
                        <div className="text-xs text-gray-500">
                            ID: {record.CitezenIdentification}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Vị trí',
            dataIndex: 'RecentLocation',
            key: 'location',
            render: (location: string) => (
                <div className="flex items-center space-x-2">
                    <EnvironmentOutlined className="text-gray-500" />
                    <Text className="text-gray-700">{location}</Text>
                </div>
            )
        },
        {
            title: 'Giá trả',
            dataIndex: 'AuctionPrice',
            key: 'price',
            render: (price: number, record: ExtendedAuctionRoundPrice) => (
                <div className="text-right">
                    <Text
                        strong
                        className={`text-lg ${record.isWinning ? 'text-green-600' : 'text-gray-800'}`}
                    >
                        {formatCurrency(price)}
                    </Text>
                    {record.rank && record.rank <= 3 && (
                        <div className="text-xs text-gray-500 mt-1">
                            Top {record.rank}
                        </div>
                    )}
                </div>
            ),
            sorter: (a: ExtendedAuctionRoundPrice, b: ExtendedAuctionRoundPrice) =>
                a.AuctionPrice - b.AuctionPrice,
            defaultSortOrder: 'descend' as const
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (record: ExtendedAuctionRoundPrice) => (
                <div className="text-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ClockCircleOutlined />
                        <span>{formatTime(record.CreatedAt)}</span>
                    </div>
                    {record.timeFromStart && (
                        <div className="text-xs text-gray-500 mt-1">
                            +{record.timeFromStart}
                        </div>
                    )}
                </div>
            ),
            sorter: (a: ExtendedAuctionRoundPrice, b: ExtendedAuctionRoundPrice) =>
                new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 120,
            render: (record: ExtendedAuctionRoundPrice) => (
                <div className="text-center">
                    {record.isWinning ? (
                        <Tag color="success" className="!px-3 !py-1">
                            <TrophyOutlined className="mr-1" />
                            Thắng
                        </Tag>
                    ) : record.rank && record.rank <= 5 ? (
                        <Tag color="warning" className="!px-3 !py-1">
                            Top {record.rank}
                        </Tag>
                    ) : (
                        <Tag color="default" className="!px-3 !py-1">
                            Tham gia
                        </Tag>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Danh sách giá trả ({filteredBids.length})
                        </h3>
                        <p className="text-gray-600">
                            Theo dõi tất cả các lượt trả giá trong vòng đấu giá
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <Search
                            placeholder="Tìm theo tên, CCCD, địa điểm"
                            allowClear
                            onSearch={handleSearch}
                            className="w-full sm:w-80"
                            size="large"
                        />

                        <Space className="w-full sm:w-auto">
                            <Select
                                value={filterType}
                                onChange={handleFilterChange}
                                size="large"
                                className="w-full sm:w-40"
                                suffixIcon={<FilterOutlined />}
                            >
                                <Select.Option value="all">Tất cả</Select.Option>
                                <Select.Option value="winning">Đang thắng</Select.Option>
                                <Select.Option value="top10">Top 10</Select.Option>
                            </Select>

                            <Button
                                icon={<ReloadOutlined />}
                                onClick={onRefresh}
                                size="large"
                                className="!bg-gray-100 hover:!bg-gray-200 !border-gray-300"
                            >
                                Làm mới
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="p-6">
                <Table
                    columns={columns}
                    dataSource={filteredBids}
                    rowKey="AuctionRoundPriceId"
                    loading={loading}
                    pagination={{
                        total: filteredBids.length,
                        pageSize: 20,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} lượt trả giá`,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        className: "!mt-4"
                    }}
                    className="overflow-x-auto"
                    rowClassName={(record) =>
                        `hover:bg-blue-50 transition-all duration-200 ${record.isWinning ? 'bg-green-50 border-l-4 border-green-500' : ''
                        } ${record.rank && record.rank <= 3 ? 'bg-yellow-50' : ''
                        }`
                    }
                    scroll={{ x: 800 }}
                    size="middle"
                />
            </div>
        </div>
    );
};

export default BidList;
