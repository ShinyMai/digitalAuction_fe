import React from 'react';
import { Card, List, Tag, Typography } from 'antd';
import { CalendarOutlined, TeamOutlined, InboxOutlined, DollarOutlined } from '@ant-design/icons';
import { upcomingAuctions } from '../fakeData';

const { Text, Title } = Typography;

const UpcomingAuctions: React.FC = () => {
    return (
        <Card
            title="Phiên đấu giá sắp diễn ra"
            className="shadow-md"
        >
            <List
                dataSource={upcomingAuctions}
                renderItem={auction => (
                    <List.Item
                        key={auction.AuctionId}
                        className="hover:bg-blue-50 transition-colors p-4 rounded-lg cursor-pointer"
                    >
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-2">
                                <Title level={5} className="!mb-0">{auction.AuctionName}</Title>
                                <Tag color="blue">{auction.category.CategoryName}</Tag>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <CalendarOutlined className="text-blue-500" />
                                    <Text className="text-gray-600">
                                        {new Date(auction.AuctionStartDate).toLocaleString()}
                                    </Text>
                                </div>
                                <div className="flex items-center gap-2">
                                    <InboxOutlined className="text-green-500" />
                                    <Text className="text-gray-600">
                                        {auction.asset.TagName}
                                    </Text>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TeamOutlined className="text-purple-500" />
                                    <Text className="text-gray-600">
                                        {auction.participantCount} người tham gia
                                    </Text>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarOutlined className="text-orange-500" />
                                    <Text className="text-gray-600">
                                        {auction.asset.StartingPrice.toLocaleString()} VNĐ
                                    </Text>
                                </div>
                            </div>
                            <div className="mt-2">
                                {auction.Status === 0 && <Tag color="default">Nháp</Tag>}
                                {auction.Status === 1 && <Tag color="processing">Công khai</Tag>}
                                {auction.Status === 3 && <Tag color="error">Đã hủy</Tag>}
                                <Tag color="blue">{auction.documentCount} hồ sơ đã nộp</Tag>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default UpcomingAuctions;

// API Integration:
/*
GET /api/auctioneer/auctions/upcoming

Request:
  - Headers: Authorization Bearer token
  - Query params: {
      page: number,
      pageSize: number,
      sortBy?: 'AuctionStartDate' | 'StartingPrice',
      sortOrder?: 'asc' | 'desc'
    }

Response: {
  items: Array<{
    // Thông tin phiên đấu giá
    AuctionId: string;
    AuctionName: string;
    AuctionDescription: string;
    AuctionStartDate: string;
    AuctionEndDate: string;
    Status: number; // 0: Nháp, 1: Công khai, 3: Đã hủy
    CategoryId: string;

    // Thông tin tài sản
    asset: {
      AssetId: string;
      TagName: string; 
      StartingPrice: number;
      DepositPrice: number;
    };

    // Thông tin danh mục
    category: {
      CategoryId: string;
      CategoryName: string;
    };

    // Thông tin bổ sung
    participantCount: number; // Số người tham gia
    documentCount: number;    // Số hồ sơ đã nộp
  }>;
  total: number;
  page: number;
  pageSize: number;
}
*/
