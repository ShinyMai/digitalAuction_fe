import { Row, Col, Space } from 'antd';
import StatisticsCards from './components/StatisticsCards';
import UpcomingAuctions from './components/UpcomingAuctions';
import AuctionChart from './components/AuctionChart';
import QuickActions from './components/QuickActions';
import ActivityTimeline from './components/ActivityTimeline';
import NotificationCenter from './components/NotificationCenter';
import AuctionCalendar from './components/AuctionCalendar';
import PerformanceMetrics from './components/PerformanceMetrics';

const DashboardAuctioneer = () => {
    return (
        <div className="p-4 md:p-6">
            {/* Quick Actions - Ẩn trên mobile, hiện ở màn lớn hơn sm */}
            <div className="hidden sm:block mb-6">
                <QuickActions />
            </div>

            {/* Thống kê tổng quan - Responsive grid */}
            <div className="mb-6">
                <StatisticsCards />
            </div>

            {/* Grid layout cho nội dung chính */}
            <Row gutter={[16, 16]}>
                {/* Cột trái - Thông tin chính */}
                <Col xs={24} xl={16}>
                    <Row gutter={[16, 16]}>
                        {/* Phiên đấu giá sắp diễn ra */}
                        <Col xs={24} md={24}>
                            <UpcomingAuctions />
                        </Col>

                        {/* Biểu đồ - Ẩn trên mobile */}
                        <Col xs={24} md={24}>
                            <div className="hidden md:block">
                                <AuctionChart />
                            </div>
                        </Col>

                        {/* Timeline hoạt động */}
                        <Col xs={24} md={24}>
                            <ActivityTimeline />
                        </Col>
                    </Row>
                </Col>

                {/* Cột phải - Thông tin phụ */}
                <Col xs={24} xl={8}>
                    <Space
                        direction="vertical"
                        className="w-full"
                        size="large"
                        style={{ display: 'flex' }}
                    >
                        {/* Thông báo - Luôn hiển thị */}
                        <div className="order-first xl:order-none">
                            <NotificationCenter />
                        </div>

                        {/* Lịch - Ẩn trên mobile */}
                        <div className="hidden md:block">
                            <AuctionCalendar />
                        </div>

                        {/* Hiệu suất - Ẩn trên mobile */}
                        <div className="hidden md:block">
                            <PerformanceMetrics />
                        </div>
                    </Space>
                </Col>

                {/* Quick Actions cho mobile */}
                <Col xs={24} className="block sm:hidden">
                    <QuickActions />
                </Col>
            </Row>
        </div>
    );
};

export default DashboardAuctioneer;

// API Integration Documentation:
/*
Các interface mở rộng từ ModalsDatabase.ts:

interface DashboardStatistics {
    // Kế thừa từ Auctions
    totalAuctions: number;
    completedAuctions: number;
    pendingAuctions: number;
    cancelledAuctions: number;
    
    // Thêm mới cho dashboard
    totalParticipants: number;
    successRate: number;
    totalValue: number;
    
    // Hoạt động gần đây
    recentActivities: {
        timestamp: string;
        type: 'auction_completed' | 'document_verified' | 'participant_joined';
        description: string;
        auctionId?: string; // Reference to Auctions.AuctionId
        userId?: string;    // Reference to User.UserId
    }[];
}

2. Phiên đấu giá sắp diễn ra:
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
  items: Array<Auctions & {
    asset: AuctionAsset;
    participantCount: number; // Số người tham gia
    documentCount: number;    // Số hồ sơ đã nộp
  }>;
  total: number;
  page: number;
  pageSize: number;
}

3. Thống kê theo tháng:
GET /api/auctioneer/statistics/monthly
Request:
  - Headers: Authorization Bearer token
  - Query params: {
      year: number,
      month: number
    }
Response: {
  summary: {
    totalAuctions: number,
    successfulAuctions: number,
    totalValue: number,
    avgParticipants: number
  },
  dailyStats: {
    date: string,
    auctionCount: number,
    participantCount: number,
    totalValue: number
  }[]
}

4. Thông báo của đấu giá viên:
GET /api/auctioneer/notifications
Request:
  - Headers: Authorization Bearer token
  - Query params: {
      page: number,
      pageSize: number,
      isRead?: boolean
    }
Response: {
  items: Array<Noctification & {
    auction?: {
        AuctionId: string;
        AuctionName: string;
        Status: number;
    };
  }>;
  total: number;
  unreadCount: number;
}

5. Lịch đấu giá:
GET /api/auctioneer/calendar/events
Request:
  - Headers: Authorization Bearer token
  - Query params: {
      startDate: string, // YYYY-MM-DD
      endDate: string    // YYYY-MM-DD
    }
Response: {
  events: Array<{
    // Từ Auctions
    AuctionId: string;
    AuctionName: string;
    AuctionStartDate: string;
    AuctionEndDate: string;
    Status: number;
    
    // Thông tin bổ sung
    type: 'auction' | 'document_review';
    asset?: {
        AssetId: string;
        TagName: string;
        StartingPrice: number;
    };
    participantCount?: number;
    documentCount?: number;
  }>;
}

6. Hiệu suất đấu giá viên:
GET /api/auctioneer/performance-metrics
Request:
  - Headers: Authorization Bearer token
  - Query params: {
      period: 'daily' | 'weekly' | 'monthly'
    }
Response: {
  metrics: {
    // Tỷ lệ thành công
    auctionSuccessRate: {
      current: number;    // Tỷ lệ hiện tại
      previous: number;   // Tỷ lệ kỳ trước
      change: number;     // % thay đổi
    };
    
    // Tỷ lệ xử lý hồ sơ
    documentProcessingRate: {
      current: number;    // Số hồ sơ xử lý/ngày
      previous: number;
      change: number;
    };
    
    // Thời gian phản hồi trung bình
    averageResponseTime: {
      current: number;    // Phút
      previous: number;
      change: number;
    };
  };
  
  // Chi tiết theo ngày
  dailyStats: Array<{
    date: string;
    completedAuctions: number;
    processedDocuments: number;
    averageResponseTime: number;
    totalParticipants: number;
  }>;
  
  // Thêm mới: Thống kê theo loại tài sản
  assetTypeStats: Array<{
    categoryId: string;   // Reference to AuctionCategory
    categoryName: string;
    totalAuctions: number;
    successRate: number;
    totalValue: number;
  }>;
}

WebSocket Events:
1. Cập nhật realtime:
Socket Channel: 'auctioneer-dashboard'
Events:
  - 'new_auction': Partial<Auctions> & {
      asset?: Partial<AuctionAsset>;
    }
    
  - 'auction_status_changed': {
      AuctionId: string;
      Status: number;
      UpdatedAt: string;
      UpdatedBy: string;
    }
    
  - 'new_notification': Noctification
  
  - 'document_submitted': {
      AuctionId: string;
      AuctionDocumentId: string;
      UserId: string;
      StatusTicket: number;
      CreateAtTicket: string;
    }
    
  - 'bid_placed': {
      AuctionId: string;
      AuctionRoundId: string;
      UserName: string;
      AuctionPrice: number;
      CreatedAt: string;
    }

Các trạng thái cần quản lý:
- Loading state cho từng phần
- Error state và error boundary
- Socket connection cho realtime updates
- Cache strategy cho API calls (sử dụng localStorage cho monthly statistics)
*/
