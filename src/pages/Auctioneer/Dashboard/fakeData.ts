import type { DashboardAuction, CompletedAuction, DashboardStatistics } from './types';

export const upcomingAuctions: DashboardAuction[] = [
    {
        AuctionId: '1',
        AuctionName: 'Đấu giá Bất động sản Q9',
        AuctionDescription: 'Phiên đấu giá bất động sản tại Quận 9',
        AuctionRules: 'Quy định đấu giá theo thông tư...',
        AuctionPlanningMap: '/maps/q9.pdf',
        RegisterOpenDate: '2025-07-20T00:00:00',
        RegisterEndDate: '2025-07-24T23:59:59',
        AuctionStartDate: '2025-07-25T09:00:00',
        AuctionEndDate: '2025-07-25T17:00:00',
        AuctionMap: '/maps/location.pdf',
        CreatedAt: '2025-07-01T10:00:00',
        CreatedBy: 'ADMIN',
        UpdatedAt: '2025-07-01T10:00:00',
        UpdatedBy: 'ADMIN',
        QRLink: 'https://example.com/qr/1',
        NumberRoundMax: 3,
        Status: 1, // Public
        WinnerData: '',
        CategoryId: 'BDS',
        AuctioneersId: 'ACT001',
        CancelReason: '',
        CancelReasonFile: '',
        asset: {
            AssetId: 'AST001',
            TagName: 'Lô đất A1',
            StartingPrice: 1000000000,
            Unit: 'VND',
            DepositPrice: 100000000,
            RegistrationFee: 500000,
            Description: 'Lô đất mặt tiền...',
            CreatedAt: '2025-07-01T10:00:00',
            CreatedBy: 'ADMIN',
            UpdatedAt: '2025-07-01T10:00:00',
            UpdatedBy: 'ADMIN',
            AuctionId: '1'
        },
        participantCount: 20,
        documentCount: 15,
        category: {
            CategoryId: 'BDS',
            CategoryName: 'Bất động sản'
        }
    },
    {
        AuctionId: '2',
        AuctionName: 'Đấu giá xe ô tô thu giữ',
        AuctionDescription: 'Phiên đấu giá xe ô tô thu giữ',
        AuctionRules: 'Quy định đấu giá theo thông tư...',
        AuctionPlanningMap: '/maps/vehicles.pdf',
        RegisterOpenDate: '2025-07-21T00:00:00',
        RegisterEndDate: '2025-07-25T23:59:59',
        AuctionStartDate: '2025-07-26T14:00:00',
        AuctionEndDate: '2025-07-26T17:00:00',
        AuctionMap: '/maps/location.pdf',
        CreatedAt: '2025-07-02T10:00:00',
        CreatedBy: 'ADMIN',
        UpdatedAt: '2025-07-02T10:00:00',
        UpdatedBy: 'ADMIN',
        QRLink: 'https://example.com/qr/2',
        NumberRoundMax: 3,
        Status: 1, // Public
        WinnerData: '',
        CategoryId: 'XE',
        AuctioneersId: 'ACT001',
        CancelReason: '',
        CancelReasonFile: '',
        asset: {
            AssetId: 'AST002',
            TagName: 'Xe Mercedes C300',
            StartingPrice: 800000000,
            Unit: 'VND',
            DepositPrice: 80000000,
            RegistrationFee: 500000,
            Description: 'Xe Mercedes C300 đời 2020...',
            CreatedAt: '2025-07-02T10:00:00',
            CreatedBy: 'ADMIN',
            UpdatedAt: '2025-07-02T10:00:00',
            UpdatedBy: 'ADMIN',
            AuctionId: '2'
        },
        participantCount: 15,
        documentCount: 10,
        category: {
            CategoryId: 'XE',
            CategoryName: 'Phương tiện'
        }
    }
];

export const recentAuctions: CompletedAuction[] = [
    {
        AuctionId: '3',
        AuctionName: 'Đấu giá đất nền Bình Chánh',
        AuctionDescription: 'Phiên đấu giá đất nền tại Bình Chánh',
        AuctionRules: 'Quy định đấu giá theo thông tư...',
        AuctionPlanningMap: '/maps/binhchanh.pdf',
        RegisterOpenDate: '2025-07-15T00:00:00',
        RegisterEndDate: '2025-07-19T23:59:59',
        AuctionStartDate: '2025-07-20T09:00:00',
        AuctionEndDate: '2025-07-20T17:00:00',
        AuctionMap: '/maps/location.pdf',
        CreatedAt: '2025-07-01T10:00:00',
        CreatedBy: 'ADMIN',
        UpdatedAt: '2025-07-20T17:00:00',
        UpdatedBy: 'ADMIN',
        QRLink: 'https://example.com/qr/3',
        NumberRoundMax: 3,
        Status: 1, // Completed
        WinnerData: 'USER123',
        CategoryId: 'BDS',
        AuctioneersId: 'ACT001',
        CancelReason: '',
        CancelReasonFile: '',
        asset: {
            AssetId: 'AST003',
            TagName: 'Lô đất B2',
            StartingPrice: 5000000000,
            Unit: 'VND',
            DepositPrice: 500000000,
            RegistrationFee: 500000,
            Description: 'Lô đất mặt tiền...',
            CreatedAt: '2025-07-01T10:00:00',
            CreatedBy: 'ADMIN',
            UpdatedAt: '2025-07-20T17:00:00',
            UpdatedBy: 'ADMIN',
            AuctionId: '3'
        },
        participantCount: 25,
        documentCount: 20,
        category: {
            CategoryId: 'BDS',
            CategoryName: 'Bất động sản'
        },
        finalPrice: 15000000000,
        successRate: 100
    }
];

export const statisticsData: DashboardStatistics = {
    totalAuctions: 45,
    completedAuctions: 42,
    pendingAuctions: 2,
    cancelledAuctions: 1,
    totalParticipants: 350,
    totalValue: 250000000000,
    monthlyStats: [
        { 
            month: 'Jan', 
            auctions: 4,
            completedAuctions: 4,
            totalValue: 20000000000,
            participantCount: 30
        },
        { 
            month: 'Feb', 
            auctions: 6,
            completedAuctions: 5,
            totalValue: 30000000000,
            participantCount: 45
        },
        { 
            month: 'Mar', 
            auctions: 5,
            completedAuctions: 5,
            totalValue: 25000000000,
            participantCount: 40
        }
    ]
};
